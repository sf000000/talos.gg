import Link from "next/link";
import React from "react";

const DmcaPage = () => {
  return (
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-lg font-medium">
        DMCA Notice of Copyright Infringement
      </h1>
      <p className="mt-4">
        talos.gg respects the intellectual property rights of others and expects
        its users to do the same. It is our policy to respond to any
        infringement notices in accordance with the Digital Millennium Copyright
        Act (DMCA). Please note that talos.gg does not host any pirated or
        infringing content on our servers. We only provide links to content that
        is hosted and distributed by third parties. We do not upload, store, or
        distribute any such content ourselves. However, we take copyright
        infringement seriously and will remove any infringing links upon
        receiving a valid DMCA notice.
      </p>
      <p className="mt-4">
        If you believe that a link on our website leads to content that
        infringes your copyright, please provide us with the following
        information:
      </p>
      <ul className="mt-4 list-disc pl-4">
        <li>
          <span className="font-semibold">
            Identification of the copyrighted work
          </span>
          : Provide a description of the copyrighted work you claim has been
          infringed, or if multiple works are involved, a representative list of
          such works.
        </li>
        <li>
          <span className="font-semibold">
            Identification of the infringing material
          </span>
          : Provide a description of the material you claim is infringing and
          that you request to be removed, including a direct link (URL) to the
          infringing material as it appears on our website.
        </li>
        <li>
          <span className="font-semibold">Contact Information</span>: Provide
          your full name, email address, and telephone number.
        </li>
      </ul>
      <p className="mt-4">
        Upon receiving your notice, we will take appropriate action, including
        removing or disabling access to the allegedly infringing material.
      </p>
      <p className="mt-4">
        Please send your DMCA notice to{" "}
        <Link
          className="text-blue-500 font-semibold"
          href="mailto:talos@null.net"
        >
          talos@null.net
        </Link>
      </p>
    </div>
  );
};

export default DmcaPage;
