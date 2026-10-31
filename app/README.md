# Star Steps for the App Store

This folder is a thin iOS shell around the live site. It is a Capacitor app whose web view
loads `https://brwnll.github.io/star-steps/`, so **pushing to `main` updates the app for
everyone** with no App Store resubmission. Apple allows this: guideline 2.5.2 permits code
that runs inside WebKit. You only need a new build when you change something in this folder
(icon, splash, name, bundle id, iOS settings).

```
app/
  capacitor.config.json   the site URL, the offline page, iOS settings
  www/offline.html        shown when the site cannot be reached
  assets/                 1024px icon sources; `npm run assets` regenerates the iOS icon + splash
  ios/App/App.xcodeproj   the Xcode project (open with `npm run open`)
```

The site knows when it runs inside the app (`window.Capacitor`) and hides its "Add to
Home Screen" prompts.

## Build and run

```bash
cd app
npm install
npm run sync      # copies www/ and the config into the Xcode project; rerun after editing capacitor.config.json
npm run open      # opens Xcode
```

In Xcode pick a simulator or your iPad and press Run.

## Submitting (one-time setup)

1. **Apple Developer Program** ($99/year): https://developer.apple.com/programs/
2. In Xcode: Settings → Accounts → add your Apple ID. Then select the `App` target →
   *Signing & Capabilities* → tick *Automatically manage signing* and pick your Team.
   The bundle id is `com.brwnll.starsteps`; change it in the same pane if you prefer
   another, and keep `appId` in `capacitor.config.json` in sync.
3. **App Store Connect** (https://appstoreconnect.apple.com): My Apps → + → New App.
   Platform iOS, name *Star Steps*, primary language English, the same bundle id, SKU
   anything (e.g. `starsteps`).
4. In Xcode choose *Any iOS Device (arm64)* as the destination, then
   Product → Archive → Distribute App → App Store Connect → Upload.
5. Back in App Store Connect fill in the listing and press *Submit for Review*.

For each later native build: bump *Version* (e.g. 1.0.1) in the target's General tab,
archive, upload, submit. Web-only changes need none of this.

## The listing

- **Category:** Education. **Do not opt into the Kids Category.** Kids Category apps may not
  contain third-party ads or analytics (guideline 1.3), and the embedded YouTube player is
  third-party content that can show ads. Star Steps itself collects nothing.
- **Age rating:** answer the questionnaire honestly; everything is "None". For
  "Unrestricted Web Access" answer No: the only web content is YouTube videos from channels
  a parent chose. Expected rating 4+.
- **App Privacy:** "Data Not Collected". Star Steps has no accounts, no analytics and no
  servers of its own; settings live on the device. The YouTube embed uses the
  privacy-enhanced domain (youtube-nocookie.com). The video search goes through your
  Cloudflare Worker, which stores nothing.
- **Privacy policy URL:** required even for "Data Not Collected". A short page on the
  GitHub Pages site saying the above is enough (for example `privacy.html`).
- **Screenshots:** 13" iPad and 6.9"/6.7" iPhone sets are required. Take them in the
  simulator (`Cmd+S`) or on the device.
- **Review notes** (the box reviewers read): explain that the game is for grades 1 to 3,
  that answering questions earns minutes of parent-approved YouTube video, that the
  ⚙️ Grown-ups screen is for parents and sits behind a small gate, and that no sign-in is
  needed. Reviewers reject thin wrappers under guideline 4.2, so point out the five subjects,
  the drag/tap/build/slide questions and the chores system.
- **Export compliance:** already answered in `Info.plist` (`ITSAppUsesNonExemptEncryption`
  is false, the app only uses HTTPS), so the upload will not ask.

## Things to know

- **Offline:** the app needs a connection the first time. After that WebKit's cache usually
  keeps the quiz working, but the service worker that makes the website work offline does
  not run inside the app (that needs Apple's App-Bound Domains, which would also block the
  YouTube frames). If the site is unreachable the app shows `www/offline.html`.
- **YouTube:** videos play in the same embedded player as on the web. YouTube Premium
  sign-in cookies do not carry over from Safari into the app.
- **Android:** the same setup works with `npx cap add android`; Play Store rules for
  "Designed for Families" are similar to Apple's Kids Category, so stay out of that program
  too while YouTube is embedded.
