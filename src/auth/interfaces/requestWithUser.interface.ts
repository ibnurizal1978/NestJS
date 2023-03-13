import { Request } from 'express';
import { Users } from 'src/users/entities/users.entity';

interface RequestWithUser extends Request {
  user: Users;
}

export default RequestWithUser;
