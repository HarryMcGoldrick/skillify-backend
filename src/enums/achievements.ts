const badges = {
    NODE_COMPLETER: {
        name: 'Node Completer',
        color: 'green',
    },
    NODE_CRUSHER: {
        name: 'Node Crusher',
        color: 'yellow',
    },
    MAP_CREATOR: {
        name: 'Map Creator',
        color: 'red',
    }
}

const achievements = {
    COMPLETE_ONE_NODE: 'COMPLETE_ONE_NODE',
    COMPLETE_TEN_NODES: 'COMPLETE_TEN_NODES',
    CREATE_ONE_MAP: 'CREATE_ONE_MAP',
};

const achievementObjects = [
    {
        type: achievements.COMPLETE_ONE_NODE,
        name: 'Complete a node',
        description: 'Complete a single node in progress mode!',
        rewardBadge: badges.NODE_COMPLETER,
        image: 'placeholder'
    },
    {
        type: achievements.COMPLETE_TEN_NODES,
        name: 'Complete ten nodes',
        description: 'Complete ten nodes in progress mode!',
        rewardBadge: badges.NODE_CRUSHER,
        image: 'placeholder'
    },
    {
        type: achievements.CREATE_ONE_MAP,
        name: 'Create a skill map',
        description: 'Create a new skill map!',
        rewardBadge: badges.MAP_CREATOR,
        image: 'placeholder'
    },

];

export default achievementObjects;