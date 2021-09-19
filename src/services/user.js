import {database} from '../firebase'

const db = database.ref().child("user");

class UserService {

  create(user) {
    return db.push().set(user);
  }

  fetch(key) {
    return db.child(key);
  }

  fetchUser(userId) {
    return db.orderByChild('email').equalTo(userId)
  }
}

export default new UserService();
