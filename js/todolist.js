export default class ToDoList {

    constructor() {
        this._list = [];
    }

    getList() {
        return this._list;
    }

    clearList() {
        this._list = [];
    }

    addItemToList(itemObj) {
        this._list.push(itemObj);
    }

    removeItemFromList(id) {
        const list = this._list;
        for (let i = 0; i < list.length; i++) {
            // === is strict equals: considers operands of different types
            // to be different
            if (list[i]._id == id) {
                // at position i, remove 1 item
                list.splice(i, 1);
                break;

            }
        }
    }

}