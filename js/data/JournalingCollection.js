/*global troop, sntls */
troop.postpone(sntls, 'JournalingCollection', function () {
    "use strict";

    var hOP = Object.prototype.hasOwnProperty,
        base = sntls.Collection;

    /**
     * @name sntls.JournalingCollection.create
     * @function
     * @param {object} [items] Initial contents.
     * @returns {sntls.JournalingCollection}
     */

    /**
     * Collection that keeps a log of changes.
     * @class sntls.JournalingCollection
     * @extends sntls.Collection
     */
    sntls.JournalingCollection = base.extend()
        .addMethods(/** @lends sntls.JournalingCollection# */{
            /**
             * @param {object} [items] Initial contents.
             * @ignore
             */
            init: function (items) {
                base.init.apply(this, arguments);

                /**
                 * Change log
                 * @type {Array}
                 */
                this.log = [];
            },

            /**
             * Sets an item in the collection.
             * @param {string} name Item name.
             * @param item Item variable / object.
             * @returns {sntls.JournalingCollection}
             */
            setItem: function (name, item) {
                var isInCollection = hOP.call(this.items, name);

                base.setItem.apply(this, arguments);

                // logging change
                this.log.unshift({
                    method: isInCollection ? 'change': 'add',
                    name  : name,
                    item  : item // before the change
                });

                return this;
            },

            /**
             * Removes item from sntls.LOOKUP.
             * @param {string} name Item name.
             * @returns {sntls.JournalingCollection}
             */
            deleteItem: function (name) {
                var isInCollection = hOP.call(this.items, name),
                    oldItem = this.items[name];

                base.deleteItem.apply(this, arguments);

                if (isInCollection) {
                    // adding to log
                    this.log.unshift({
                        method: 'remove',
                        name  : name,
                        item  : oldItem
                    });
                }

                return this;
            },

            /**
             * Empties collection.
             * @returns {sntls.JournalingCollection}
             */
            clear: function () {
                base.clear.apply(this, arguments);
                this.resetLog();
                return this;
            },

            /**
             * Resets collection log.
             * @returns {sntls.JournalingCollection}
             */
            resetLog: function () {
                var log = this.log;
                log.splice(0, log.length);
                return this;
            }
        });
});

(function () {
    "use strict";

    sntls.Hash.addMethods(/** @lends sntls.Hash# */{
        /**
         * @returns {sntls.JournalingCollection}
         */
        toJournalingCollection: function () {
            return sntls.JournalingCollection.create(this.items);
        }
    });
}());
