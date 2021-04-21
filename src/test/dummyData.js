export const dummyNode = {
    _id: 'Dummy Oid',
    data: {
        id: 'Dummy Id',
        label: 'Dummy Label'
    },
    position: {
        x: 0,
        y: 0
    }
}

export const dummyEdge = {
    _id: 'Dummy Oid',
    data: {
        id: 'Dummy Id',
        source: 'Dummy Source',
        target: 'Dummy Target'
    },
    position: {
        x: 0,
        y: 0
    }
}

export const dummyStyleSheet =  [{
    selector: 'Dummy Selector',
    style: {
       dummyStyleProperty: 'Dummy Style Property'
    }
}]

export const dummyGraph = {
    tags: ["Dummy Tag"],
    name: "Dummy Name",
    description: "Dummy Description",
    createdById: "5fc65a71c522501e806a5403",
    nodes: [dummyNode],
    edges: [],
    styleSheet: dummyStyleSheet,
    image: ''
};

export const dummyObjective = {
        userId: "5fc65a71c522501e806a5403",
        nodeId: "Dummy Node Id",
        items: [{
            "label": "Dummy Label",
            "checked": true,
            "id": 0
        }],
}

export const dummyAchievement = {
    type: 'Dummy Reward',
    name: 'Dummy Name',
    description: 'Dummy Description',
    rewardBadge: {
        type: 'Dummy Badge Type',
        name: 'Dummy Badge Name',
        color: 'Dummy Badge Color',
    },
    image: 'Dummy Image'
};

export const dummyTags = [
    {tag: 'Dummy Tag'},
    {tag: 'Dummy Tag2'}
]

export const dummyUser = {
    username: "Dummy User",
    password: "Dummy Password",
    graphs_created: [],
    likedContent: [],
    likedGraph: [],
    achievements: [],
    badges: [],
    graphs_progressing: [],
    private: false,
    image: "Dummy Image",
    likedGraphs: []
}

export const dummyContent = {
    nodeId: "Dummy Node Id",
    type: "Dummy Type",
    externalId: "Dummy External Id",
    score: 0,
}