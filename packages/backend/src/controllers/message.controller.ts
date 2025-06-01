import { Request, Response, NextFunction } from 'express';
import { MessageService } from '../services/message.service';
import { CreateMessageDTO, UpdateMessageDTO } from '../types/message.types';
import { AppError } from '../utils/error';

const messageService = new MessageService();

export class MessageController {
  async createMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { shipmentId } = req.params;
      const { receiverId, content } = req.body;
      const senderId = req.user!.userId;
      
      const message = await messageService.createMessage(
        shipmentId,
        senderId,
        receiverId,
        content
      );
      
      res.status(201).json({
        status: 'success',
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMessage(req: Request, res: Response) {
    const { id } = req.params;
    const message = await messageService.getMessageById(id);
    res.json(message);
  }

  async updateMessage(req: Request, res: Response) {
    const { id } = req.params;
    const messageData: UpdateMessageDTO = req.body;
    const message = await messageService.updateMessage(id, messageData);
    res.json(message);
  }

  async deleteMessage(req: Request, res: Response) {
    const { id } = req.params;
    await messageService.deleteMessage(id);
    res.status(204).send();
  }

  async getShipmentMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { shipmentId } = req.params;
      const messages = await messageService.getShipmentMessages(shipmentId);
      
      res.status(200).json({
        status: 'success',
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyMessages(req: Request, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const messages = await messageService.getUserMessages(userId);
    res.json(messages);
  }

  async markMessageAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { messageId } = req.params;
      const userId = req.user!.userId;
      
      const message = await messageService.markMessageAsRead(messageId, userId);
      
      res.status(200).json({
        status: 'success',
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }
} 