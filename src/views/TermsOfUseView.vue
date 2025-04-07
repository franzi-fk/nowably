<template>
  <div class="terms-of-use-tile page-padding-inline flex-grow">
    <LinkButton
      type="icon-text"
      icon="arrowLeft"
      text="Go Back"
      @click="$router.back()"
    />
    <h1>Terms of Use</h1>
    <p><strong>Effective Date:</strong> 01.04.2025</p>
    <h2>1. About This App</h2>
    <p>
      Nowably ("the App") is a to-do and productivity app designed to help users
      defeat procrastination, start to their tasks and stay motivated with
      positive reinforcement. Users can share moments of success with other
      users by sending and receiving "Messages in a Bottle".
    </p>
    <p>
      The App was created by Franziska Kiel, a UX/UI Designer and Frontend
      Developer based in Germany.
      <a href="https://github.com/franzi-fk" class="inline-link"
        >Open GitHub Profile</a
      >
    </p>

    <p>By using the App, you agree to these Terms of Use.</p>

    <h2>2. Acceptance of Terms</h2>
    <p>
      By accessing or using the App, you acknowledge that you have read,
      understood, and agreed to these Terms of Use. If you do not agree with any
      part of these terms, you should discontinue use immediately.
    </p>

    <h2>3. User Responsibilities</h2>
    <ul>
      <li>Use the App for lawful purposes only.</li>
      <li>
        Do not attempt to access, modify, or interfere with the App’s systems.
      </li>
      <li>
        Do not distribute, copy, or exploit any content within the App without
        permission.
      </li>
      <li>
        Do not engage in any activity that disrupts the App’s functionality or
        user experience.
      </li>
    </ul>

    <h2>4. "Message in a Bottle" Guidelines</h2>
    <p>
      To ensure a positive and safe experience for all users, messages should
      <strong>not</strong> contain:
    </p>
    <ul>
      <li>
        Personal information (e.g., names, phone numbers, addresses, emails).
      </li>
      <li>Advertisements, links, or product/service recommendations.</li>
      <li>Hate speech, offensive language, or discrimination.</li>
      <li>Illegal content or anything that violates applicable laws.</li>
      <li>Negative, harmful, or discouraging messages.</li>
    </ul>
    <p>
      The purpose of this feature is to provide
      <strong>wholesome, supportive, and completely anonymous</strong> messages
      to users who are in need of some encouraging words. Any misuse may result
      in removal of messages or restrictions on access.
    </p>

    <h2>5. Intellectual Property & Copyright</h2>
    <p>
      All content, trademarks, logos, illustrations, and intellectual property
      within the App are owned by Franziska Kiel, unless otherwise stated.
      Below, we detail the ownership and licensing of the content used in the
      App.
    </p>
    <h3>5.1 License</h3>
    <p>
      This project is licensed under the
      <strong
        >Creative Commons Attribution-NonCommercial-NoDerivatives 4.0
        International (CC BY-NC-ND 4.0) License</strong
      >. You may share the content with attribution but may not use it for
      commercial purposes or modify it in any way. For details, visit
      <a
        href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
        target="_blank"
        class="inline-link"
        >Creative Commons License</a
      >.
    </p>
    <h3>5.2 Ownership of Content Created by Franziska Kiel</h3>
    <p>
      The following content is created and owned by Franziska Kiel and is
      protected by copyright:
    </p>
    <ul>
      <li>
        <strong>App Illustrations:</strong> All illustrations created by
        Franziska Kiel are protected by copyright.
      </li>
      <li>
        <strong>App Concept and Features:</strong> The idea, features, and
        overall design of the App are the intellectual property of Franziska
        Kiel.
      </li>
      <li>
        <strong>Logo:</strong> The logo used in the App is designed and owned by
        Franziska Kiel.
      </li>
    </ul>

    <h3>5.3 Use of Third-Party Assets</h3>
    <p>
      The App includes certain third-party assets that are licensed for use
      under their respective terms. These assets are used with proper
      attribution and/or licensing:
    </p>
    <ul>
      <li>
        <strong>Fonts:</strong> The App uses
        <a href="https://fonts.bunny.net/" class="inline-link">BunnyFonts</a>,
        which are licensed for use but remain the property of their respective
        creators.
      </li>
      <li>
        <strong>Completion Card Illustrations:</strong> The App includes
        illustrations from
        <a href="https://cocomaterial.com/" class="inline-link">Coco Material</a
        >, which are used under their respective license.
      </li>
      <li>
        <strong>Icons:</strong> The App uses
        <a href="https://lucide.dev/" class="inline-link">Lucide Icons</a>,
        which are also subject to their own licensing terms.
      </li>
    </ul>

    <h2>6. GDPR Compliance & Privacy Policy</h2>
    <p>
      In compliance with the
      <strong>General Data Protection Regulation (GDPR)</strong>, we respect
      your privacy and collect minimal data necessary for basic functionality.
    </p>
    <ul>
      <li>
        <strong>Data Collection:</strong> The App does not store or track
        personally identifiable information. Only anonymized usage data may be
        collected.
      </li>
      <li>
        <strong>Your Rights:</strong> As an EU user, you can request access,
        correction, or deletion of any personal data (if applicable).
      </li>
      <li>
        <strong>Data Security:</strong> We take measures to ensure the security
        of your data and prevent unauthorized access.
      </li>
    </ul>
    <p>
      For full details, review our
      <RouterLink :to="{ name: 'privacy-policy' }" class="inline-link"
        >Privacy Policy</RouterLink
      >.
    </p>

    <h2>7. Disclaimers and Limitation of Liability</h2>
    <ul>
      <li>The App is provided "as is" without warranties of any kind.</li>
      <li>
        We do not guarantee that the App will be error-free, uninterrupted, or
        meet your needs.
      </li>
      <li>
        We are not responsible for any damages resulting from your use of the
        App.
      </li>
    </ul>

    <h2>8. Changes to These Terms</h2>
    <p>
      We may update these Terms of Use at any time. Continued use of the App
      constitutes acceptance of the revised terms.
    </p>

    <h2>9. Termination</h2>
    <p>
      We may suspend or terminate your access if you violate these Terms or
      engage in harmful behavior.
    </p>

    <h2>10. Governing Law</h2>
    <p>
      These Terms are governed by the laws of Germany and subject to the
      jurisdiction of German courts.
    </p>

    <h2>11. Contact Information</h2>
    <p>
      If you have any questions, contact us at
      <a href="mailto:[Your Contact Email]" class="inline-link"
        >nowably.app@gmail.com</a
      >.
    </p>
  </div>
</template>

<style scoped>
.terms-of-use-tile {
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
