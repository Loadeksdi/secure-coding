import { Session } from '../../entities/session.js'
import { User } from '../../entities/user.js'
import { AppDataSource } from '../../lib/typeorm.js'
import { buildUserFixture } from './users-fixtures.spec.js'

type SessionFixtureOptions = { user?: User }

export const buildSessionFixture = (opts: SessionFixtureOptions) => {
    const session = new Session()
    session.user = opts.user ?? buildUserFixture()
    return session
}

export const createSessionFixture = async (opts: SessionFixtureOptions = {}) => {
    return AppDataSource.getRepository(Session).save(buildSessionFixture(opts))
}