const { AuthenticationError } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions');
const Store = require("./models/Store")

const pubsub = new PubSub();
const STORE_ADDED = "STORE_ADDED";
const STORE_DELETED = "STORE_DELETED";
const STORE_UPDATED = "STORE_UPDATED";

const authenticated = next => (root, args, ctx, info) => {
    if(!ctx.currentUser){
        throw new AuthenticationError('You must be logged in')
    }
    return next(root, args, ctx, info)
}

module.exports = {
    Query : {
        me: authenticated((root, args, ctx ) => ctx.currentUser),
        getStores: async (root, args, ctx) => {
            const stores = await Store.find({})
              .populate("shopper")
              .populate("items.shopper");
            return stores;
          }
    },
    Mutation: {
        createStore: authenticated(async (root, args, ctx) => {
          const newStore = await new Store({
            ...args.input,
            shopper: ctx.currentUser._id
          }).save();
          const storeAdded = await Store.populate(newStore, "shopper");
          pubsub.publish(STORE_ADDED, { storeAdded });
          console.log(newStore)
          return storeAdded;
          
        }),
        deleteStore: authenticated(async (root, args, ctx) => {
          const StoreDeleted = await Store.findOneAndDelete({
            _id: args.storeId
          }).exec();
          console.log({ StoreDeleted });
          pubsub.publish(STORE_DELETED, { StoreDeleted });
          return StoreDeleted;
        }),
        createItem: authenticated(async (root, args, ctx) => {
          const newItem = { text: args.text, shopper: ctx.currentUser._id };
          const storeUpdated = await Store.findOneAndUpdate(
            { _id: args.storeId },
            { $push: { items: newItem } },
            { new: true }
          )
            .populate("shopper")
            .populate("items.shopper");
          pubsub.publish(STORE_UPDATED, { storeUpdated });
          return storeUpdated;
        })
      },
      Subscription: {
        storeAdded: {
          subscribe: () => pubsub.asyncIterator(STORE_ADDED)
        },
        storeDeleted: {
          subscribe: () => pubsub.asyncIterator(STORE_DELETED)
        },
        storeUpdated: {
          subscribe: () => pubsub.asyncIterator(STORE_UPDATED)
        }
      }
}