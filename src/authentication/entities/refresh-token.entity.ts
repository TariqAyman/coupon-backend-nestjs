import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn({ name: 'device_id' })
  deviceId: number;

  @Column()
  username: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @Column({ name: 'device_ip' })
  deviceIP: string;

  @Column({ name: 'device_name' })
  deviceName: string;

  @Column({ name: 'device_location' })
  deviceLocation: string;

  @Column({ type: 'timestamp' })
  expiry: Date;

  @Column({ name: 'tenant_id' })
  tenantId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
