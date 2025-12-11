export class User {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  role!: string;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  set fullName(value: string) {
    const parts = value.split(' ');

    this.firstName = parts[0] || '';
    this.lastName = parts.slice(1).join(' ') || '';
  }
}
