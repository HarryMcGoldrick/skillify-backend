import { addAchievement, addBadge, getUserInfoFromDatabase } from '../controllers/user-controller';
import { achievements, badges } from '../enums/achievements';

export const checkForAchievements = async (userId) => {
    let achievementsAdded = [];
    const userInfo = await getUserInfoFromDatabase(userId)
    const { achievements: achievementArray } = userInfo;

    if (achievementArray) {

        if (!(achievementArray.includes(achievements.CREATE_ONE_MAP))) {
            if(checkCreateOneGraph(userInfo)) {
                addAchievementAndBadge(userId, achievements.CREATE_ONE_MAP, badges.MAP_CREATOR)
                achievementsAdded.push(achievements.CREATE_ONE_MAP)
            }
        }

        if (!(achievementArray.includes(achievements.COMPLETE_ONE_NODE))) {
            if(checkCompleteOneNode(userInfo)) {
                addAchievementAndBadge(userId, achievements.COMPLETE_ONE_NODE, badges.NODE_COMPLETER)
                achievementsAdded.push(achievements.COMPLETE_ONE_NODE)
            }
        }

        if (!(achievementArray.includes(achievements.COMPLETE_TEN_NODES))) {
            if(checkCompleteTenNodes(userInfo)) {
                addAchievementAndBadge(userId, achievements.COMPLETE_TEN_NODES, badges.NODE_CRUSHER)
                achievementsAdded.push(achievements.COMPLETE_TEN_NODES)
            }
        }

    }

    return achievementsAdded;
}

const addAchievementAndBadge = (userId, achievement, badge) => {
    addAchievement(userId, achievement);
    addBadge(userId, badge);
}

const checkCreateOneGraph = (userInfo) => {
    const { graphs_created, _id: userId } = userInfo;
    if (graphs_created && graphs_created.length >= 1) {
        return true;
    } else {
        return false;
    }
}

const checkCompleteOneNode = (userInfo) => {
    return getCompletedNodeCount(userInfo) >= 1;
}

const checkCompleteTenNodes = (userInfo) => {
    return getCompletedNodeCount(userInfo) >= 10;
}


export const getCompletedNodeCount = (userInfo) => {
    let completedNodeCount = 0;
    const {graphs_progressing: graphs} = userInfo;
    
    if (graphs && graphs.length > 0) {
        graphs.forEach((graph) => {
            completedNodeCount += graph.completedNodes.length;
        })
    }

    return completedNodeCount;
}