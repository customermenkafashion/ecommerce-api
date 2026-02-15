
export class UserCreatedEvent {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
  ) {
    console.log('✅ UserCreatedEvent registered 1');
  }
}


export class UserUpdatedEvent {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
  ) {}
}


export class UserDeletedEvent {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
  ) {}
}


export class UserRestoredEvent {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
  ) {}
}


