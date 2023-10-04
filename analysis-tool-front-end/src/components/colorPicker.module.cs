.wrapper {
  display: grid;
  grid-template-columns: 450px 1fr;
  min-height: 100vh;

  color: white;
}

/* Left column */
.leftColumn {
  width: 100%;
  height: 100vh;

  background: #22232b;
  padding: 1.6rem;

  position: sticky;
  top: 0;
}

.headingText {
  margin: 0;
  margin-bottom: 1.6rem;
}

.formSection {
  margin-bottom: 1.6rem;
}

.formSection > p {
  font-size: 1rem;
  margin-bottom: 0.6rem;
  color: #ededf1;
}

.openPickerButton {
  width: 100%;

  background: #6c738b;
  color: white;
  border: none;

  font-size: 1rem;
  padding: 0.8em 0.8em;
  border-radius: 0.2rem;

  cursor: pointer;

  transition: 0.2s background;
}

.openPickerButton:hover {
  background: #46495e;
}

.selectedColor {
  width: 100%;
  height: 150px;

  border: none;
  cursor: pointer;
  border-radius: 0.4rem;

  transition: 0.2s background;

  display: grid;
  place-items: center;
  color: white;
  font-size: 1.2rem;
}

.shoutout {
  color: #6c738b;

  position: absolute;
  bottom: 1.6rem;
  left: 1.6rem;
}

.shoutout > a {
  color: #b59cfd;
}

/* Right column */
.rightColumn {
  background: #363844;
  padding: 2.4rem;
  display: grid;
  place-content: center;

  position: relative;
  overflow: hidden;
}

.rightColumn > img {
  width: 100%;
  height: auto;
  max-width: 900px;
  margin: auto;

  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);

  position: relative;
  z-index: 10;
}

.rightColumn > div {
  position: absolute;
  inset: 0;
  z-index: 0;

  background-size: cover;
  background-position: center;
  scale: 1.2;

  filter: blur(4px);
  opacity: 0.5;
}