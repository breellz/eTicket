import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { IUser, User } from "./user.entity";
import { IEvent, Event } from "./event.entity";

export class Bookings {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: "userId" })
  user: IUser;

  @ManyToOne(() => Event, (event) => event.bookings)
  @JoinColumn({ name: "eventId" })
  event: IEvent;

  @Column()
  eventId: number;

  @Column()
  tickets: number;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updatedAt: Date;
}

export type IBookings = {
  [T in keyof Bookings]: Bookings[T];
};