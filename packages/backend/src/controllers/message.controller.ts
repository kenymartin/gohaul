import { Request, Response } from 'express';
import { MessageService } from '../services/message.service';
import { CreateMessageDTO, UpdateMessageDTO } from '../types/message.types';
import { AppError } from '../utils/error';

const messageService = new MessageService();

export class MessageController {
  async createMessage(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const messageData: CreateMessageDTO = {
      ...req.body,
      senderId: req.user.userId
    };
    const message = await messageService.createMessage(messageData);
    res.status(201).json(message);
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

  async getShipmentMessages(req: Request, res: Response) {
    const { shipmentId } = req.params;
    const messages = await messageService.getShipmentMessages(shipmentId);
    res.json(messages);
  }

  async getMyMessages(req: Request, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const messages = await messageService.getUserMessages(userId);
    res.json(messages);
  }

  async markAsRead(req: Request, res: Response) {
    const { id } = req.params;
    const message = await messageService.markAsRead(id);
    res.json(message);
  }
} 