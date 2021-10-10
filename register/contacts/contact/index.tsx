import { useState } from "react";
import Link from "next/link";
import { mutate } from "swr";

import ButtonLink from "@/components/button-link";
import Button from "@/components/button";

function Contact({ id, name, email }) {
  const [deleting, setDeleting] = useState(false);

  async function deleteContact() {
    setDeleting(true);
    let res = await fetch(`/api/delete-entry?id=${id}`, { method: "DELETE" });
    let json = await res.json();
    if (!res.ok) throw Error(json.message);
    mutate("/api/get-entries");
    setDeleting(false);
  }
  return (
    <div>
      <div className="flex items-center">
        <Link href={`/entry/${id}`}>
          <a className="font-bold py-2">{name}</a>
        </Link>
        <div className="flex ml-4">
          <ButtonLink
            href={`/entry/edit/${id}?name=${name}&email=${email}`}
            className="h-5 py-0 mx-1"
          >
            Edit
          </ButtonLink>
          <Button
            disabled={deleting}
            onClick={deleteContact}
            className="h-5 py-0 mx-1"
          >
            {deleting ? "Deleting ..." : "Delete"}
          </Button>
        </div>
      </div>
      <p>{email}</p>
    </div>
  );
}

export default Contact;
