import { Request, Response } from 'express';

export type ApiContext = {
  req: Request;
  res: Response;
};
