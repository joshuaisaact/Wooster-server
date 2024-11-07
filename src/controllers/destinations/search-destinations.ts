import { Request, Response } from 'express';
import { db } from '../../db';
import { destinations } from '../../db';
import { and, ilike, eq, sql, SQL } from 'drizzle-orm';

interface SearchParams {
  page?: string;
  search?: string;
  country?: string;
}

type SearchRequest = Request<
  Record<never, never>,
  {
    destinations: (typeof destinations.$inferSelect)[];
    totalCount: number;
    hasMore: boolean;
  },
  never,
  SearchParams
>;

export async function handleSearchDestinations(
  req: SearchRequest,
  res: Response,
) {
  const page = parseInt(
    Array.isArray(req.query.page)
      ? req.query.page[0] || '1'
      : req.query.page || '1',
  );
  const search = Array.isArray(req.query.search)
    ? req.query.search[0] || ''
    : req.query.search || '';
  const country = Array.isArray(req.query.country)
    ? req.query.country[0] || 'all'
    : req.query.country || 'all';

  console.log('Search params:', { page, search, country }); // Add logging

  const ITEMS_PER_PAGE = 12;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  try {
    // Build where conditions array
    const conditions: SQL[] = [];

    if (search) {
      conditions.push(ilike(destinations.destinationName, `%${search}%`));
    }

    if (country && country !== 'all') {
      conditions.push(eq(destinations.country, country));
    }

    // Combine conditions with AND if there are any
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(destinations)
      .where(whereClause || undefined);

    const totalCount = Number(countResult.count);

    // Get paginated results
    const results = await db
      .select()
      .from(destinations)
      .where(whereClause || undefined)
      .orderBy(destinations.destinationName)
      .limit(ITEMS_PER_PAGE)
      .offset(offset);

    return res.json({
      destinations: results,
      totalCount,
      hasMore: totalCount > offset + ITEMS_PER_PAGE,
    });
  } catch (error) {
    console.error('Error searching destinations:', error);
    return res.status(500).json({
      error: 'Failed to search destinations',
    });
  }
}
