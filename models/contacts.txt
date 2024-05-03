const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");
const contactsPath = path.join(__dirname, "contacts.json");

const writeFileHelper = async (filePath, data) => {
  await fs.writeFile(filePath, data);
};
const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  console.log(contacts);
  const result = contacts.find((contact) => contact.id === contactId);
  console.log("result", result);
  return result || null;
};

const removeContacts = async (contactId) => {
  const contacts = await listContacts();

  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index !== -1) {
    const [removedContacts] = contacts.splice(index, 1);
    writeFileHelper(contactsPath, JSON.stringify(contacts, null, 2));

    return removedContacts;
  } else {
    return null;
  }
};

const addContacts = async (body) => {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...body,
  };

  contacts.push(newContact);
  writeFileHelper(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

const updateContacts = async (contactId, body) => {
  const contacts = await listContacts();

  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index !== -1) {
    contacts[index] = { contactId, ...body };
    writeFileHelper(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index];
  } else {
    return null;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContacts,
  addContacts,
  updateContacts,
  writeFileHelper,
};
