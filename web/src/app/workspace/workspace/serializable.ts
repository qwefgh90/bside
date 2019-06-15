import { Pack } from './pack';
import { WorkspacePack } from './workspace-pack';

export interface Serializable {
    serialize(): WorkspacePack;
    deserialize(pack: WorkspacePack): boolean;
}
