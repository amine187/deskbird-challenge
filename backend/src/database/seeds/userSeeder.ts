import { User } from '../../users/users.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import userData from '../data.json';

const usersToSeed: Partial<User>[] = userData as Partial<User>[];

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    console.log(
      `\n Starting JSON seed for Users (${userData.length} records found)`,
    );

    const usersToSave: User[] = [];
    const emails = new Set<string>();

    for (const data of usersToSeed) {
      if (!emails.has(data.email!) && data.email) {
        emails.add(data.email);

        const user = new User();
        user.email = data.email;
        user.firstName = data.firstName!;
        user.lastName = data.lastName!;
        user.role = data.role!;
        user.password = data.password!;

        usersToSave.push(user);
      } else {
        console.warn(
          `⚠️ Warning: Duplicate email found and skipped: ${data.email}`,
        );
      }
    }

    if (usersToSave.length === 0) {
      console.log(`🔴 No unique users to seed. Skipping insertion`);
      return;
    }

    try {
      await userRepository.save(usersToSave, { chunk: 50 });

      console.log(
        `✅ Successfully seeded ${usersToSave.length} unique users from JSON file.`,
      );
    } catch (error) {
      console.log(`❌ Failed to seed users from JSON. Database error`, error);
    }
  }
}
