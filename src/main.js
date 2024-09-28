const { BrowserWindow, Notification } = require("electron");
const { getConnection } = require("./database");

let window;

if (!getConnection) {
  console.error('Connection to database failed');
  return;
}

const createUser = async (user) => {
  try {
    const conn = await getConnection();
    const result = await conn.query("INSERT INTO users SET ?", user);
    user.id = result.insertId;

    // Notify the User
    new Notification({
      title: "Electron MySQL",
      body: "New User Saved Successfully",
    }).show();

    // Return the created User
    return user;
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async () => {
  const conn = await getConnection();
  const results = await conn.query("SELECT * FROM users ORDER BY id DESC");
  return results;
};

const deleteUser = async (id) => {
  const conn = await getConnection();
  const result = await conn.query("DELETE FROM users WHERE id = ?", id);
  
  // Notify the User
  new Notification({
    title: "Electron MySQL",
    body: "User Deleted Successfully",
  }).show();
  
  return result;
};

const getUserById = async (id) => {
  const conn = await getConnection();
  const result = await conn.query("SELECT * FROM users WHERE id = ?", id);
  return result[0];
};

const updateUser = async (id, user) => {
  const conn = await getConnection();
  const result = await conn.query("UPDATE users SET ? WHERE id = ?", [
    user,
    id,
  ]);
  
  // Notify the User
  new Notification({
    title: "Electron MySQL",
    body: "User Updated Successfully",
  }).show();
  
  console.log(result);
};

function createWindow() {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  window.loadFile("src/ui/index.html");
}

module.exports = {
  createWindow,
  createUser,
  getUsers,
  deleteUser,
  getUserById,
  updateUser
};