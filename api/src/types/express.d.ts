import auth from '@/lib/auth';

type Authsession = ReturnType<typeof auth>['$Infer']['Session'];

declare global {
  namespace Express {
    interface Request {
      user: Authsession['user'];
      session: Authsession;
    }
  }
}
