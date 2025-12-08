import { User } from '../../users/users.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import userData from '../data.json';

const usersToSeed: User[] = userData as User[];

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    console.log(
      `\n Starting JSON seed for Users (${userData.length} records found)`,
    );

    const uniqueUsers: User[] = [];
    const emails = new Set<string>();

    for (const user of usersToSeed) {
      if (!emails.has(user.email)) {
        emails.add(user.email);
        uniqueUsers.push(user);
      } else {
        console.warn(
          `⚠️ Warning: Duplicate email found and skipped: ${user.email}`,
        );
      }
    }

    if (uniqueUsers.length === 0) {
      console.log(`🔴 No unique users to seed. Skipping insertion`);
      return;
    }

    try {
      await userRepository.insert(uniqueUsers);

      console.log(
        `✅ Successfully seeded ${uniqueUsers.length} unique users from JSON file.`,
      );
    } catch (error) {
      console.log(`❌ Failed to seed users from JSON. Database error`, error);
    }
  }
}
