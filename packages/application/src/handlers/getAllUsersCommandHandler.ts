// import { GetAllUsersEvent, User } from "@planv5/domain";
// import { HandlerBase } from "../core/handlerBase";
// import { GetAllUsersCommand } from "@planv5/domain/commands";
// import { Repository } from "../ports";
// import { inject, injectable } from "inversify";
// import { APP_TYPES } from "../ports/types";
// import { EventEmitter } from "events";

// @injectable()
// export class GetAllUsersHandler extends HandlerBase<GetAllUsersCommand> {
//   private readonly userRepository: Repository<User>;
//   private readonly eventEmitter: EventEmitter;

//   public constructor(
//     @inject(APP_TYPES.Repository) userRepository: Repository<User>,
//     @inject(EventEmitter) eventEmitter: EventEmitter
//   ) {
//     super();
//     this.userRepository = userRepository;
//     this.eventEmitter = eventEmitter;
//   }

//   public getCommandInstance(): GetAllUsersCommand {
//     return new GetAllUsersCommand();
//   }

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   public async execute(command: GetAllUsersCommand): Promise<void> {
//     const users: User[] = await this.userRepository.getAll();
//     if (users.length === 0) {
//       // TODO handle error
//       return;
//     }
//     const event = new GetAllUsersEvent(users);
//     this.eventEmitter.emit("response", event);
//   }

//   public toString(): string {
//     return "GetAllUsersHandler";
//   }
// }
