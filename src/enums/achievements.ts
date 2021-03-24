import { toDataURL } from "../utils/image";
export const rewardType = {
    BADGE: 'BADGE',
    ACHIEVEMENT: 'ACHIEVEMENT'
}

export const badges = {
    NODE_COMPLETER: {
        type: rewardType.BADGE,
        name: 'Node Completer',
        color: 'green',
    },
    NODE_CRUSHER: {
        type: rewardType.BADGE,
        name: 'Node Crusher',
        color: 'yellow',
    },
    MAP_CREATOR: {
        type: rewardType.BADGE,
        name: 'Map Creator',
        color: 'red',
    }
}

export const achievements = {
    COMPLETE_ONE_NODE: 'Complete one node!',
    COMPLETE_TEN_NODES: 'Complete ten nodes!',
    CREATE_ONE_MAP: 'Create one map!',
};

// Image should come from URL maybe s3 bucket?
// Manually adding them for now!
export const achievementObjects = [
    {
        type: rewardType.ACHIEVEMENT,
        name: achievements.COMPLETE_ONE_NODE,
        description: 'Complete a single node in progress mode!',
        rewardBadge: badges.NODE_COMPLETER,
        image: 'placeholder'
    },
    {
        type: rewardType.ACHIEVEMENT,
        name: achievements.COMPLETE_TEN_NODES,
        description: 'Complete ten nodes in progress mode!',
        rewardBadge: badges.NODE_CRUSHER,
        image: 'placeholder'
    },
    {
        type: rewardType.ACHIEVEMENT,
        name: achievements.CREATE_ONE_MAP,
        description: 'Create a new skill map!',
        rewardBadge: badges.MAP_CREATOR,
        image: 'placeholder'
    },

];
