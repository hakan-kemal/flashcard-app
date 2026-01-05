import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { flashcardService } from '../services/flashcard.service.js';

interface CreateFlashcardBody {
  question: string;
  answer: string;
  category: string;
}

interface UpdateFlashcardBody {
  question?: string;
  answer?: string;
  category?: string;
}

interface FlashcardParams {
  id: string;
}

interface GetFlashcardsQuery {
  category?: string;
}

export async function flashcardRoutes(fastify: FastifyInstance) {
  // GET /api/flashcards - Get all flashcards
  fastify.get<{ Querystring: GetFlashcardsQuery }>(
    '/flashcards',
    async (request, reply) => {
      try {
        const { category } = request.query;
        const flashcards = await flashcardService.getAll(
          category ? { category } : undefined
        );
        return flashcards;
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ error: 'Failed to fetch flashcards' });
      }
    }
  );

  // GET /api/flashcards/:id - Get a single flashcard
  fastify.get<{ Params: FlashcardParams }>(
    '/flashcards/:id',
    async (request, reply) => {
      try {
        const { id } = request.params;
        const flashcard = await flashcardService.getById(id);
        
        if (!flashcard) {
          return reply.status(404).send({ error: 'Flashcard not found' });
        }
        
        return flashcard;
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ error: 'Failed to fetch flashcard' });
      }
    }
  );

  // POST /api/flashcards - Create a new flashcard
  fastify.post<{ Body: CreateFlashcardBody }>(
    '/flashcards',
    async (request, reply) => {
      try {
        const { question, answer, category } = request.body;
        
        if (!question || !answer || !category) {
          return reply.status(400).send({ 
            error: 'Missing required fields: question, answer, category' 
          });
        }

        const flashcard = await flashcardService.create({
          question,
          answer,
          category,
        });
        
        reply.status(201).send(flashcard);
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ error: 'Failed to create flashcard' });
      }
    }
  );

  // PUT /api/flashcards/:id - Update a flashcard
  fastify.put<{ Params: FlashcardParams; Body: UpdateFlashcardBody }>(
    '/flashcards/:id',
    async (request, reply) => {
      try {
        const { id } = request.params;
        const data = request.body;

        const flashcard = await flashcardService.update(id, data);
        return flashcard;
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ error: 'Failed to update flashcard' });
      }
    }
  );

  // DELETE /api/flashcards/:id - Delete a flashcard
  fastify.delete<{ Params: FlashcardParams }>(
    '/flashcards/:id',
    async (request, reply) => {
      try {
        const { id } = request.params;
        await flashcardService.delete(id);
        reply.status(204).send();
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ error: 'Failed to delete flashcard' });
      }
    }
  );

  // POST /api/flashcards/:id/increment - Increment known count
  fastify.post<{ Params: FlashcardParams }>(
    '/flashcards/:id/increment',
    async (request, reply) => {
      try {
        const { id } = request.params;
        const flashcard = await flashcardService.incrementKnownCount(id);
        return flashcard;
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ error: 'Failed to increment known count' });
      }
    }
  );

  // POST /api/flashcards/:id/reset - Reset known count
  fastify.post<{ Params: FlashcardParams }>(
    '/flashcards/:id/reset',
    async (request, reply) => {
      try {
        const { id } = request.params;
        const flashcard = await flashcardService.resetKnownCount(id);
        return flashcard;
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ error: 'Failed to reset known count' });
      }
    }
  );

  // GET /api/categories - Get all categories with counts
  fastify.get('/categories', async (request, reply) => {
    try {
      const categories = await flashcardService.getCategoriesWithCounts();
      return categories;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Failed to fetch categories' });
    }
  });
}
