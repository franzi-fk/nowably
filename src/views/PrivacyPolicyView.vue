<template>
  <div class="policy-tile page-padding-inline flex-grow">
    <LinkButton
      type="icon-text"
      icon="arrowLeft"
      text="Go Back"
      @click="$router.back()"
    />
    <h1>Privacy Policy</h1>
    <p><strong>Effective Date:</strong> 01.04.2025</p>

    <h2>1. Who We Are</h2>
    <p>
      Nowably ("we," "us," or "our") is a to-do and productivity app designed to
      help users defeat procrastination, start to their tasks and stay motivated
      with positive reinforcement. Users can share moments of success with other
      users by sending and receiving "Messages in a Bottle".
    </p>
    <p>The data controller responsible for your personal data is:</p>
    <p>
      Franziska Kiel <br />
      Rheingoldstraße 157 <br />
      68199 Mannheim <br />
      Germany <br />
    </p>
    <p>
      Phone: +49 1525 357 59 24<br />
      Email:
      <a href="mailto:nowably.app@gmail.com" class="inline-link"
        >nowably.app@gmail.com</a
      >
    </p>
    <p>
      Legal Notice:
      <RouterLink :to="{ name: 'legal-notice' }" class="inline-link"
        >nowably.me/legal-notice</RouterLink
      >
    </p>

    <h2>2. What Data We Collect</h2>

    <h3>2.1. Authentication Data (Google Sign-In via Firebase)</h3>
    <p>
      When you sign up, we collect your email address and any other personal
      information provided during registration via Google Sign-in.
    </p>
    <ul>
      <li>Display name (Google name)</li>
      <li>Email address</li>
      <li>Timestamp of Nowably user creation (first sign-in on Nowably)</li>
      <li>Nowably user ID (UID) (created with Nowably user creation)</li>
    </ul>

    <h3>2.2. Task Data (Stored in Firestore)</h3>
    <p>
      This includes any data you provide when creating, editing, updating and
      deleting tasks through our service.
    </p>
    <ul>
      <li>Task description</li>
      <li>Task state (open or done)</li>
      <li>Timestamp of completion</li>
      <li>User ID (UID) associated with the task</li>
      <li>Deleted completed tasks</li>
    </ul>

    <h3>2.3. "Messages in a Bottle" Data (Stored in Firestore)</h3>
    <p>
      This includes any data you provide when creating and receiving "Messages
      in a Bottle" through our service.
    </p>
    <ul>
      <li>All received "Messages in a Bottle"</li>
      <li>All created "Messages in a Bottle" (messages you send)</li>

      <li>Daily count of created "Messages in a Bottle"</li>
      <li>Timestamp of last received "Message in a Bottle"</li>
    </ul>

    <h3>2.4. User Statistics & Permissions</h3>
    <ul>
      <li>Total number of completed tasks</li>
      <li>Role (user / admin)</li>
    </ul>

    <h3>2.5. Log & Usage Data</h3>
    <p><strong>IONOS (our hosting provider) automatically collects:</strong></p>
    <ul>
      <li>IP addresses</li>
      <li>Browser type & version</li>
      <li>Date & time of access</li>
    </ul>
    <p>We do not use this data for tracking or analytics.</p>

    <h2>3. How We Use Your Data</h2>
    <ul>
      <li>Authenticating users via Google Sign-In</li>
      <li>
        Saving tasks and "Messages in a Bottle" so you can access them later
      </li>
      <li>Providing gamified insights (e.g. tracking success counts)</li>
      <li>Maintaining app functionality and security</li>
    </ul>
    <p>
      We do not sell, share, or use your data for advertising. We do not use
      personal data for marketing, advertising, or user profiling purposes. We
      do not send promotional emails, track users for analytics, or target users
      based on their behavior.
    </p>

    <h2>4. Where Your Data Is Stored</h2>
    <table>
      <tr>
        <th>Data Type</th>
        <th>Storage Location</th>
      </tr>
      <tr>
        <td>Tasks & "Messages in a Bottle"</td>
        <td>Firestore: EU, Frankfurt (europe-west3)</td>
      </tr>
      <tr>
        <td>Authentication data (email, display name, UID)</td>
        <td>Firebase Authentication: Stored in the US</td>
      </tr>
      <tr>
        <td>Logs (IP, access data)</td>
        <td>IONOS: EU-based servers</td>
      </tr>
    </table>

    <h2>5. Your Rights Under GDPR</h2>
    <ul>
      <li>Right to Access: Request a copy of your stored data.</li>
      <li>Right to Deletion: Delete your account and all associated data.</li>
      <li>Right to Rectification: Correct any incorrect data.</li>
      <li>
        Right to Restrict Processing: Ask us to stop processing your data.
      </li>
      <li>
        Right to Data Portability: Request a structured copy of your data.
      </li>
    </ul>
    <p>
      To exercise these rights, contact us at:
      <strong>nowably.app@gmail.com</strong>
    </p>

    <h2>6. How to Delete Your Data</h2>
    <ul>
      <li>
        Deleting Your Incompleted Tasks: You can manually delete them in the
        app.
      </li>
      <li>
        Deleting Your Completed Tasks: Deleted completed tasks are stored for 48
        hours before being permanently deleted. This deletion is triggered when
        the user logs into the app, where a check is performed to determine if
        the tasks have exceeded the 48-hour retention period.<br />
        Contact us at
        <strong>nowably.app@gmail.com</strong> to request direct deletion.
      </li>
      <li>
        Deleting Your Sent "Messages in a Bottle": Contact us at
        <strong>nowably.app@gmail.com</strong> to request deletion.
      </li>
      <li>
        Deleting Your Account: You can delete your account on
        <RouterLink :to="{ name: 'delete-account' }" class="inline-link"
          >nowably.me/delete-account</RouterLink
        >. Deleting your account will result in the permanent and irreversible
        deletion of all associated data and content linked to your account.
      </li>
    </ul>
    <p>
      We retain your personal data for as long as your account is active. Once
      you delete your account, all associated data is deleted, including any
      user-generated content, such as "Messages in a Bottle" or other content
      linked to your account. There is no retention period for any data after
      account deletion.
    </p>

    <h2>7. Third-Party Services</h2>
    <table>
      <tr>
        <th>Service</th>
        <th>Purpose</th>
        <th>Location</th>
      </tr>
      <tr>
        <td>Google Firebase</td>
        <td>Authentication</td>
        <td>US</td>
      </tr>
      <tr>
        <td>Google Firestore</td>
        <td>Data Storage</td>
        <td>EU</td>
      </tr>
      <tr>
        <td>IONOS</td>
        <td>Hosting & Access Logs</td>
        <td>EU</td>
      </tr>
    </table>

    <h2>8. Security Measures</h2>
    <ul>
      <li>Google Firebase Security Rules to prevent unauthorized access.</li>
      <li>HTTPS Encryption for secure data transmission.</li>
      <li>
        User authentication via Google Sign-In to ensure only you access your
        data.
      </li>
    </ul>
    <p>
      We take the security of your personal data seriously. We use
      industry-standard security measures to protect your data from unauthorized
      access, alteration, and destruction. However, please be aware that no
      method of data transmission over the internet or electronic storage is
      100% secure.
    </p>

    <h2>9. Changes to This Privacy Policy</h2>
    <p>
      We may update this policy to reflect changes in legal requirements or our
      services. If we make significant updates, we will notify you by:
    </p>
    <ul>
      <li>Posting the updated policy on this page.</li>
      <li>Sending an email if necessary.</li>
    </ul>
    <p>Last Updated: 01.04.2025</p>

    <h2>10. Contact Us</h2>
    <p>
      If you have questions about this policy or how we handle your data,
      contact us at:
    </p>
    <p><strong>nowably.app@gmail.com</strong></p>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  data() {
    return {
      router: useRouter(),
    };
  },
};
</script>

<style scoped>
.policy-tile {
  width: 100%;
  height: 100%;
  max-width: 70ch;
  margin-inline: auto;
  padding-block: 1rem 5rem;
}

h1 {
  margin-block: 2.25rem 1.3rem;
}
h2 {
  margin-block: 2.25rem 1rem;
}
h3 {
  margin-block: 2rem 0.5rem;
}

p {
  margin-block: 0.5rem;
  line-height: 150%;
}

ul {
  margin-block: 0.5rem 1rem;
  padding-left: 1.2rem;
}
li {
  margin-block: 0.4rem;
  line-height: 160%;
}

table {
  border-collapse: collapse;
  margin: 1.5rem 0;
  width: 100%;
  border-radius: 0.4rem;
  overflow: hidden;
}

table th {
  background-color: var(--cotton-01);
  text-align: left;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.04rem;
}

table th,
table td {
  padding: 0.75rem 0.9375rem;
}

table td {
  border-bottom: 0.125rem solid var(--cotton-01);
  background-color: var(--secondary);
}

table tr:last-of-type {
  border-bottom: 0.75rem solid var(--cotton-01);
}

/*_______________________________________________________*/

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
}

/* X-Large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
}

/* XX-Large devices (larger desktops, 1400px and up) */
@media (min-width: 1400px) {
}
</style>
