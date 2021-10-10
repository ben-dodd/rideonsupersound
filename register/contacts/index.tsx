import Contact from "./contact";

function Contacts({ contacts }) {
  if (contacts) {
    return (
      <div>
        {contacts.map((e) => (
          <div key={e.id} className="py-2">
            <Contact id={e.id} name={e.name} email={e.email} />
          </div>
        ))}
      </div>
    );
  } else {
    return null;
  }
}

export default Contacts;
