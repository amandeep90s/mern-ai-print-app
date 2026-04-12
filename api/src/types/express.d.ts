import { getAuth } from '@/lib/auth';

type Authsession = ReturnType<typeof getAuth>['$Infer']['Session'];

declare global {
  namespace Express {
    interface Request {
      user: Authsession['user'];
      session: Authsession;
    }
  }
}
