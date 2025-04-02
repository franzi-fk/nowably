<template>
  <div class="legal-notice-tile page-padding-inline flex-grow">
    <LinkButton
      type="icon-text"
      icon="arrowLeft"
      text="Go Back"
      @click="$router.back()"
    />
    <h1>Legal Notice</h1>
    <p><strong>According to § 5 TMG (Telemedia Act)</strong></p>

    <h2>Responsible for this website & web app</h2>
    <p>
      Franziska Kiel <br />
      Rheingoldstraße 157 <br />
      68199 Mannheim <br />
      Germany <br />
    </p>

    <h2>Contact Information</h2>
    <p>
      Phone: +49 1525 357 59 24<br />
      Email:
      <a href="mailto:nowably.app@gmail.com" class="inline-link"
        >nowably.app@gmail.com</a
      >
      <br />
    </p>

    <h2>VAT Identification Number</h2>
    <p>not applicable</p>

    <h2>Register Entry</h2>
    <p>not applicable</p>

    <h2>Dispute Resolution</h2>
    <p>
      The European Commission provides a platform for online dispute resolution
      (OS):
    </p>
    <p>
      <a
        href="https://ec.europa.eu/consumers/odr/"
        target="_blank"
        class="inline-link"
        >https://ec.europa.eu/consumers/odr/</a
      >
    </p>
    <p>
      We are neither willing nor obligated to participate in dispute resolution
      proceedings before a consumer arbitration board.
    </p>

    <h2>Liability for Content</h2>
    <p>
      We make every effort to keep the information on our website up to date,
      but we do not assume any liability for the content provided. According to
      § 7 (1) TMG, as a service provider, we are responsible for our own content
      on these pages under general law. However, according to §§ 8 to 10 TMG, we
      are not obligated to monitor transmitted or stored third-party information
      or investigate circumstances that indicate illegal activity.
    </p>

    <h2>Liability for Links</h2>
    <p>
      Our website contains links to external third-party websites, over which we
      have no control. Therefore, we cannot assume any liability for this
      external content. The respective provider or operator of the linked sites
      is always responsible for their content. Linked sites were checked for
      possible legal violations at the time of linking, and no illegal content
      was identifiable at that time.
    </p>

    <h2>Copyright</h2>
    <p>
      The content and works created by the website operator on these pages are
      subject to copyright law. The reproduction, processing, distribution, and
      any kind of use outside the limits of copyright require the written
      consent of the respective author or creator. Downloads and copies of this
      site are only permitted for private, non-commercial use.
    </p>
  </div>
</template>

<style scoped>
.legal-notice-tile {
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
