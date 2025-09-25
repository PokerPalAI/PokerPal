# Beehiiv Newsletter Integration Setup

## Getting Your Beehiiv API Credentials

### 1. Create API Key

1. Log in to your Beehiiv account
2. Navigate to `Settings` > `API` under `Workspace Settings`
3. Click on `Create New API Key`
4. Give it a descriptive name like "PokerPal Intake Form"
5. Copy the API key immediately (it won't be accessible later)

### 2. Get Your Publication ID

1. In your Beehiiv dashboard, go to your publication
2. The Publication ID is in the URL: `https://app.beehiiv.com/publication/[PUBLICATION_ID]`
3. Or you can find it in your publication settings

### 3. Environment Variables

Add these to your `.env.local` file:

```bash
# Beehiiv Integration
BEEHIIV_API_KEY=your_beehiiv_api_key_here
BEEHIIV_PUBLICATION_ID=your_publication_id_here

# Optional: Set to false if you want to make newsletter subscription optional
BEEHIIV_AUTO_SUBSCRIBE=true
```

## How It Works

When someone submits your intake form:

1. ✅ **Form data saved to Notion** (as before)
2. ✅ **Formatted document created** (as before)
3. 🆕 **Email automatically added to your Beehiiv newsletter**

### Subscriber Information

- **Email**: User's email from the form
- **Name**: User's name from the form
- **Tags**: Automatically tagged as "Founding Member Applicant"
- **Custom Fields**: Application date and status

## Testing

Once you've added the environment variables:

1. Fill out and submit the intake form
2. Check your Notion database (should work as before)
3. Check your Beehiiv subscriber list - the email should appear!

## Troubleshooting

- **Error: "Invalid API key"** - Check that your `BEEHIIV_API_KEY` is correct
- **Error: "Publication not found"** - Verify your `BEEHIIV_PUBLICATION_ID`
- **Subscriber not appearing** - Check your Beehiiv spam/pending list
- **Duplicate subscriber error** - This is normal if someone resubmits; the API handles it gracefully

## Privacy Note

Make sure your intake form includes appropriate privacy language about newsletter subscription. The integration will automatically subscribe applicants to stay updated about PokerPal.
