# Vercel Deployment Environment Variables Setup

## Required Environment Variables

To deploy this app successfully on Vercel, you need to configure the following environment variables:

### Supabase Configuration
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Network Configuration (Optional)
- `VITE_NETWORK_ID` - Network ID (default: 11155111 for Sepolia)
- `VITE_NETWORK_NAME` - Network name (default: sepolia)
- `VITE_RPC_URL` - RPC URL for blockchain connection

## How to Set Environment Variables on Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with the following format:
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://your-project.supabase.co`
   - Environment: Production, Preview, Development (select all)

4. Add the anonymous key:
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `your-anon-key-here`
   - Environment: Production, Preview, Development (select all)

## Getting Supabase Credentials

1. Go to your Supabase dashboard
2. Select your project
3. Go to Settings → API
4. Copy the "Project URL" and "anon public" key

## Alternative: Using Vercel CLI

```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

## Verify Configuration

After setting the environment variables, redeploy your app. The deployment should now work without the "Missing Supabase environment variables" error.
