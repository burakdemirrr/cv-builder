/* 
This file is no longer used since the application has been simplified to not require a database.
All CV data is now stored in memory during the user's session.
*/

// This file should only run on the server side
import 'server-only';

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma; 