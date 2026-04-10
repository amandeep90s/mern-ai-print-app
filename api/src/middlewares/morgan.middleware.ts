import morgan from 'morgan';

import logger from '@/config/logger.config';

const morganMiddleware = morgan('combined', {
  stream: {
    write: (message: string) => {
      logger.info(message.trim());
    },
  },
});

export default morganMiddleware;
