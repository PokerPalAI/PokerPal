import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import type { BlockObjectRequest } from '@notionhq/client/build/src/api-endpoints';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID || '27db423ee4cf4c9b91848fb2602d7886';

// Allowed multi-select options (must match exactly with Notion database)
const ALLOWED_PREPARATION_METHODS = new Set([
  'Hand Analysis & Solver Study (GTO)',
  'Reading Poker Books',
  'Training Videos & Courses',
  'Bankroll Management',
  'Live Coaching Sessions',
  'Physical Fitness & Health',
  'Meditation & Mindfulness',
  'Other',
]);

// Map form field IDs to readable names for Notion
const TRAINING_ID_TO_NAME_MAP: Record<string, string> = {
  'hand-solver-analysis': 'Hand Analysis & Solver Study (GTO)',
  'book-reading': 'Reading Poker Books',
  'video-training': 'Training Videos & Courses',
  'bankroll-management': 'Bankroll Management',
  'live-coaching': 'Live Coaching Sessions',
  'physical-fitness': 'Physical Fitness & Health',
  'meditation': 'Meditation & Mindfulness',
  'other': 'Other',
};

interface FormData {
  name: string;
  email: string;
  experience: string;
  training: string[];
  trainingOther?: string;
  highlight: string;
  success: string;
  alignment: string;
}

interface NotionPayload {
  name: string;
  email: string;
  pokerJourney: string;
  preparationMethods: string[];
  preparationOther?: string;
  proudestMoment: string;
  successMeaning: string;
  foundingMember: string;
  submittedAt: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: FormData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.experience || !body.highlight || !body.success || !body.alignment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Map form training IDs to Notion-compatible names
    const preparationMethods = (body.training || [])
      .map(id => TRAINING_ID_TO_NAME_MAP[id])
      .filter(name => name && ALLOWED_PREPARATION_METHODS.has(name));

    // Prepare the payload for Notion
    const payload: NotionPayload = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      pokerJourney: body.experience.trim(),
      preparationMethods,
      preparationOther: body.trainingOther?.trim() || undefined,
      proudestMoment: body.highlight.trim(),
      successMeaning: body.success.trim(),
      foundingMember: body.alignment.trim(),
      submittedAt: new Date().toISOString(),
    };

    // Create the Notion page
    const result = await createNotionEntry(payload);

    // Add to Beehiiv newsletter (if enabled)
    let beehiivResult = null;
    if (process.env.BEEHIIV_AUTO_SUBSCRIBE !== 'false') {
      try {
        beehiivResult = await addToBeehiivNewsletter(payload);
      } catch (beehiivError) {
        // Log the error but don't fail the entire submission
        console.error('Beehiiv subscription failed:', beehiivError);
        // Continue with success since Notion save worked
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Application submitted successfully',
        notionPageId: result.id,
        newsletterSubscribed: !!beehiivResult
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error submitting application:', error);
    
    // Return a user-friendly error message
    return NextResponse.json(
      { 
        error: 'Failed to submit application. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

async function createNotionEntry(payload: NotionPayload) {
  try {
    // Create formatted page content for easy reading
    const pageContent = createFormattedPageContent(payload);

    const response = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        'Name': {
          title: [{ type: 'text', text: { content: payload.name } }],
        },
        'Email': { 
          email: payload.email 
        },
        'Poker Journey': {
          rich_text: [{ type: 'text', text: { content: payload.pokerJourney } }],
        },
        'Preparation Methods': {
          multi_select: payload.preparationMethods.map(name => ({ name })),
        },
        'Preparation: Other (details)': payload.preparationOther ? {
          rich_text: [{ type: 'text', text: { content: payload.preparationOther } }],
        } : {
          rich_text: [],
        },
        'Proudest Poker Moment': {
          rich_text: [{ type: 'text', text: { content: payload.proudestMoment } }],
        },
        'What Does Success Mean To You?': {
          rich_text: [{ type: 'text', text: { content: payload.successMeaning } }],
        },
        'Why Would You Be A Strong Founding Member?': {
          rich_text: [{ type: 'text', text: { content: payload.foundingMember } }],
        },
        'Submitted At': {
          date: { start: payload.submittedAt },
        },
      },
      children: pageContent,
    });

    return response;
  } catch (notionError) {
    console.error('Notion API Error:', notionError);
    throw new Error(`Failed to save to Notion: ${(notionError as Error).message}`);
  }
}

function createFormattedPageContent(payload: NotionPayload): BlockObjectRequest[] {
  const content: BlockObjectRequest[] = [
    // Header with applicant info
    {
      object: 'block',
      type: 'heading_1',
      heading_1: {
        rich_text: [{ type: 'text', text: { content: `${payload.name} - Founding Member Application` } }],
      },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          { type: 'text', text: { content: '📧 Email: ' }, annotations: { bold: true } },
          { type: 'text', text: { content: payload.email } },
          { type: 'text', text: { content: '\n📅 Submitted: ' }, annotations: { bold: true } },
          { type: 'text', text: { content: new Date(payload.submittedAt).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })} },
        ],
      },
    },
    {
      object: 'block',
      type: 'divider',
      divider: {},
    },

    // Poker Journey
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '🎯 Poker Journey' } }],
      },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: payload.pokerJourney || '—' } }],
      },
    },

    // Preparation Methods
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '🏋️ Preparation & Training Methods' } }],
      },
    },
  ];

  // Add preparation methods as bullet points
  if (payload.preparationMethods && payload.preparationMethods.length > 0) {
    payload.preparationMethods.forEach(method => {
      content.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: method } }],
        },
      });
    });
  } else {
    content.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: '—' } }],
      },
    });
  }

  // Add "Other" details if provided
  if (payload.preparationOther) {
    content.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          { type: 'text', text: { content: 'Additional details: ' }, annotations: { italic: true } },
          { type: 'text', text: { content: payload.preparationOther } },
        ],
      },
    });
  }

  // Proudest Poker Moment
  content.push(
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '🏆 Proudest Poker Moment' } }],
      },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: payload.proudestMoment || '—' } }],
      },
    }
  );

  // What Success Means
  content.push(
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '💭 What Does Success Mean To You?' } }],
      },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: payload.successMeaning || '—' } }],
      },
    }
  );

  // Why Strong Founding Member
  content.push(
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '🚀 Why Would You Be A Strong Founding Member?' } }],
      },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: payload.foundingMember || '—' } }],
      },
    }
  );

  return content;
}

async function addToBeehiivNewsletter(payload: NotionPayload) {
  const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
  const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

  if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID) {
    console.warn('Beehiiv credentials not configured, skipping newsletter subscription');
    return null;
  }

  try {
    const subscriberData = {
      email: payload.email,
      reactivate_existing: true,
      send_welcome_email: true,
      utm_source: "poker_pal_intake_form",
      utm_medium: "founding_member_application",
      referring_site: "intake.pokerpal.com",
      custom_fields: [
        {
          name: "application_date",
          value: new Date(payload.submittedAt).toLocaleDateString()
        },
        {
          name: "applicant_name", 
          value: payload.name
        },
        {
          name: "application_status",
          value: "pending_review"
        }
      ]
    };

    const response = await fetch(`https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriberData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Beehiiv API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    console.log('Successfully added subscriber to Beehiiv:', payload.email);
    
    return {
      success: true,
      subscriberId: result.data?.id,
      email: payload.email,
    };

  } catch (error) {
    console.error('Failed to add subscriber to Beehiiv:', error);
    throw error;
  }
}
