import type { ProjectId } from '../../../../../domain/aggregates/project/id.vo';
import type { Project } from '../../../../../domain/aggregates/project/project.aggregate';
import type { ProjectTitle } from '../../../../../domain/aggregates/project/title.vo';
import type { ProjectRepository } from '../../../../../domain/repositories/project.repository';
import type { Database } from '../../../database';
import { SQLiteProjectMapper } from '../../mappers/project.mapper';
import type { SQLiteProjectRecord } from '../../records/write/project.record';
import type { SQLiteExistsRecord } from '../../records/write/query.record';

export class SQLiteProjectRepository implements ProjectRepository {
  constructor(private readonly database: Database) {}

  async findById(id: ProjectId): Promise<Project | null> {
    const project = await this.database.get<SQLiteProjectRecord>(
      `SELECT
          id,
          title,
          status,
          created_at AS createdAt,
          started_at AS startedAt,
          finished_at AS finishedAt,
          deleted_at AS deletedAt,
          description,
          category,
          icon,
          color
        FROM projects 
        WHERE id = ?
        AND deleted_at IS NULL
        LIMIT 1`,
      [id.toString()]
    );
    if (!project) return null;
    return SQLiteProjectMapper.toDomain(project);
  }

  async save(project: Project): Promise<void> {
    const persistence = SQLiteProjectMapper.toPersistence(project);
    await this.database.execute(
      `
      INSERT INTO projects
      (
          id,
          title,
          status,
          created_at,
          started_at,
          finished_at,
          deleted_at,
          description,
          category,
          icon,
          color
      )
      VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id)
      DO UPDATE SET
          title = excluded.title,
          status = excluded.status,
          created_at = excluded.created_at,
          started_at = excluded.started_at,
          finished_at = excluded.finished_at,
          deleted_at = excluded.deleted_at,
          description = excluded.description,
          category = excluded.category,
          icon = excluded.icon,
          color = excluded.color;
      `,
      [
        persistence.id,
        persistence.title,
        persistence.status,
        persistence.createdAt,
        persistence.startedAt,
        persistence.finishedAt,
        persistence.deletedAt,
        persistence.description,
        persistence.category,
        persistence.icon,
        persistence.color,
      ]
    );
  }

  async existsByTitle(title: ProjectTitle): Promise<boolean> {
    const record = await this.database.get<SQLiteExistsRecord>(
      `SELECT EXISTS(
        SELECT 1 
        FROM projects
        WHERE title = ?
        AND deleted_at IS NULL) 
      AS exists`,
      [title.toString()]
    );
    return record?.exists === 1;
  }
}
