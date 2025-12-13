import { Request, Response } from 'express';

export const getHelloWorld = async (req: Request, res: Response) => {
  try {
    
    res.json({
      success: true,
      message: 'Hello World!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Hello World!'
    });
  }
};
