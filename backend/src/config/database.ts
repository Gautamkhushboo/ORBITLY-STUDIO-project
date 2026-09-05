// backend/src/config/database.ts
import dns from 'dns';
import mongoose from 'mongoose';

export interface MongoUriDiagnostics {
  sanitizedUri: string;
  maskedUri: string;
  username?: string;
  hasPassword: boolean;
  host?: string;
  database: string;
  hasQuotes: boolean;
  hasWhitespace: boolean;
  hasAngleBrackets: boolean;
  isPlaceholder: boolean;
}

/**
 * Parses and sanitizes a MongoDB URI:
 * 1. Trims surrounding whitespace and quotes.
 * 2. Removes accidental angle brackets from credentials (<username> / <password>).
 * 3. Correctly URL-encodes special characters in credentials if not already encoded.
 * 4. Ensures a target database name (defaults to 'orbitly_studio').
 * 5. Returns a safe masked URI for logging without exposing credentials.
 */
export const parseAndSanitizeMongoUri = (rawUri?: string): MongoUriDiagnostics => {
  if (!rawUri || typeof rawUri !== 'string') {
    return {
      sanitizedUri: '',
      maskedUri: '(not set)',
      hasPassword: false,
      database: 'orbitly_studio',
      hasQuotes: false,
      hasWhitespace: false,
      hasAngleBrackets: false,
      isPlaceholder: false,
    };
  }

  const trimmed = rawUri.trim();
  const hasWhitespace = /\s/.test(rawUri);
  let uri = trimmed;
  let hasQuotes = false;

  if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
    hasQuotes = true;
    uri = uri.slice(1, -1).trim();
  }

  const protoMatch = uri.match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/i);
  if (!protoMatch) {
    return {
      sanitizedUri: uri,
      maskedUri: uri,
      hasPassword: false,
      database: 'orbitly_studio',
      hasQuotes,
      hasWhitespace,
      hasAngleBrackets: false,
      isPlaceholder: false,
    };
  }

  const proto = protoMatch[1];
  const rest = protoMatch[2];

  // Separate query parameters first
  const qIdx = rest.indexOf('?');
  const mainPart = qIdx !== -1 ? rest.slice(0, qIdx) : rest;
  const queryPart = qIdx !== -1 ? rest.slice(qIdx) : '';

  // Credentials and host separation: the last '@' before query/database path
  const lastAt = mainPart.lastIndexOf('@');
  if (lastAt === -1) {
    // No credentials provided
    return {
      sanitizedUri: uri,
      maskedUri: uri,
      hasPassword: false,
      database: 'orbitly_studio',
      hasQuotes,
      hasWhitespace,
      hasAngleBrackets: false,
      isPlaceholder: false,
    };
  }

  const credPart = mainPart.slice(0, lastAt);
  const hostAndDb = mainPart.slice(lastAt + 1);

  const colonIdx = credPart.indexOf(':');
  let username = colonIdx !== -1 ? credPart.slice(0, colonIdx) : credPart;
  let password = colonIdx !== -1 ? credPart.slice(colonIdx + 1) : '';

  const hasAngleBrackets = credPart.includes('<') || credPart.includes('>');
  const isPlaceholder =
    /^(<password>|<db_password>|<username>|<your-.*>|replace_with_.*)$/i.test(password) ||
    /^(<username>|<db_user>|<your-.*>)$/i.test(username);

  // If user wrapped their actual credentials in angle brackets (e.g. <myPassword>)
  if (username.startsWith('<') && username.endsWith('>') && username.length > 2 && !isPlaceholder) {
    username = username.slice(1, -1);
  }
  if (password.startsWith('<') && password.endsWith('>') && password.length > 2 && !isPlaceholder) {
    password = password.slice(1, -1);
  }

  // Safe URI percent-encoding (decodes first to avoid double-encoding %xx)
  const safeEncode = (val: string): string => {
    try {
      return encodeURIComponent(decodeURIComponent(val));
    } catch {
      return encodeURIComponent(val);
    }
  };

  const encodedUser = safeEncode(username);
  const encodedPass = colonIdx !== -1 ? ':' + safeEncode(password) : '';

  // Format host and database name
  let formattedHostAndDb = hostAndDb;
  const slashIdx = formattedHostAndDb.indexOf('/');
  let dbName = 'orbitly_studio';

  if (slashIdx === -1) {
    formattedHostAndDb = formattedHostAndDb + '/' + dbName;
  } else if (slashIdx === formattedHostAndDb.length - 1) {
    formattedHostAndDb = formattedHostAndDb + dbName;
  } else {
    const extractedDb = formattedHostAndDb.slice(slashIdx + 1);
    if (extractedDb) {
      dbName = extractedDb;
    } else {
      formattedHostAndDb = formattedHostAndDb + dbName;
    }
  }

  const host = slashIdx !== -1 ? formattedHostAndDb.slice(0, slashIdx) : formattedHostAndDb;

  const sanitizedUri = `${proto}${encodedUser}${encodedPass}@${formattedHostAndDb}${queryPart}`;
  const maskedUri = `${proto}${encodedUser}:${password ? '*****' : ''}@${formattedHostAndDb}${queryPart}`;

  return {
    sanitizedUri,
    maskedUri,
    username,
    hasPassword: Boolean(password),
    host,
    database: dbName,
    hasQuotes,
    hasWhitespace,
    hasAngleBrackets,
    isPlaceholder,
  };
};

export const getDatabaseStatus = (): string => {
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

let listenersAttached = false;

const setupConnectionListeners = (): void => {
  if (listenersAttached) return;
  listenersAttached = true;

  mongoose.connection.on('connected', () => {
    console.log(`✅ MongoDB connected successfully to database "${mongoose.connection.name}"`);
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB runtime connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('ℹ️ MongoDB disconnected');
  });
};

export const connectDatabase = async (overrideUri?: string): Promise<boolean> => {
  const rawUri = overrideUri || process.env.MONGODB_URI || '';

  if (!rawUri) {
    console.warn('⚠️ MONGODB_URI is not defined in environment variables. Database connection skipped.');
    return false;
  }

  const diagnostics = parseAndSanitizeMongoUri(rawUri);

  // Check for placeholder credentials
  if (diagnostics.isPlaceholder) {
    console.error('❌ MONGODB_URI contains a placeholder password/username (e.g. <password> or <username>).');
    console.error('   Please replace it with your actual MongoDB Atlas database user credentials in your environment variables.');
  }

  if (diagnostics.hasQuotes) {
    console.log('ℹ️ Note: MONGODB_URI contained quotation marks. They have been stripped automatically.');
  }

  if (diagnostics.hasWhitespace) {
    console.log('ℹ️ Note: MONGODB_URI contained extra whitespace. It has been trimmed automatically.');
  }

  if (diagnostics.hasAngleBrackets && !diagnostics.isPlaceholder) {
    console.log('ℹ️ Note: MONGODB_URI contained enclosing angle brackets (<...>). They have been stripped automatically.');
  }

  console.log(`🔌 Attempting MongoDB connection: ${diagnostics.maskedUri}`);

  try {
    // Attempt custom DNS servers if helpful, but gracefully fallback
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4']);
    } catch {
      // Ignore if environment forbids setting custom DNS
    }

    setupConnectionListeners();

    await mongoose.connect(diagnostics.sanitizedUri, {
      dbName: diagnostics.database,
      serverSelectionTimeoutMS: 10000,
    });

    return true;
  } catch (error: any) {
    const rawMessage = error?.message || 'Database connection error';
    const safeMessage = rawMessage.replace(/\/\/.*@/, '//<credentials>@');
    console.error('❌ MongoDB connection failed:', safeMessage);

    const isAuthFailure =
      rawMessage.toLowerCase().includes('bad auth') ||
      rawMessage.toLowerCase().includes('authentication failed');

    if (isAuthFailure) {
      console.error('─────────────────────────────────────────────────────────────────');
      console.error('🔐 MONGODB ATLAS AUTHENTICATION FAILURE (bad auth) DIAGNOSIS:');
      console.error(`   • Configured User:     ${diagnostics.username || '(none detected)'}`);
      console.error(`   • Target Cluster Host: ${diagnostics.host || '(none detected)'}`);
      console.error(`   • Target Database:     ${diagnostics.database}`);
      console.error('   • Immediate Steps To Fix:');
      console.error('     1. Open MongoDB Atlas -> Security -> Database Access.');
      console.error(`        Ensure a Database User exists with username "${diagnostics.username || 'your-user'}".`);
      console.error('     2. If you are unsure of the password, click "Edit" on that user in Atlas,');
      console.error('        set a new password, and copy the new password.');
      console.error('     3. In Render Dashboard -> Environment:');
      console.error('        Update MONGODB_URI with the new password.');
      console.error('        Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/orbitly_studio?retryWrites=true&w=majority');
      console.error('     4. In Atlas -> Security -> Network Access:');
      console.error('        Ensure 0.0.0.0/0 (Allow access from anywhere) is Active.');
      console.error('─────────────────────────────────────────────────────────────────');
    }

    return false;
  }
};
