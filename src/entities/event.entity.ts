import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Booking } from "./bookings.entity";
import { WaitList } from "./waitList.entity";


export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  date: Date;

  @Column()
  location: string;

  @Column()
  availableTickets: number;

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];

  @OneToMany(() => WaitList, (waitlist) => waitlist.event)
  waitlists: WaitList[];

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

export type IEvent = {
  [T in keyof Event]: Event[T];
};