<template>
  <nav class="navbar navbar-expand-lg navbar-light fixed-top bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#"><small>moneyjin 0.99.0</small></a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link" aria-current="page" href="#"
              ><i class="bi bi-currency-euro"></i
            ></a>
          </li>
          <li class="nav-item">
            <router-link
              :class="
                $route.matched.some(({ name }) => name === Routes.ListReports)
                  ? 'router-link-active nav-link'
                  : 'nav-link'
              "
              :to="{
                name: Routes.ListReports,
                params: { year: year, month: month },
              }"
              ><i class="bi bi-card-list"></i
            ></router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#"><i class="bi bi-search"></i></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#"
              ><i class="bi bi-box-arrow-in-down-right"></i
            ></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#"><i class="bi bi-ui-checks"></i></a>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-bar-chart-fill"></i>
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><a class="dropdown-item" href="#">Trends</a></li>
              <li><a class="dropdown-item" href="#">Ausgabenauswertung</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-plus-lg"></i>
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <a class="dropdown-item" href="#"
                  >Geldbewegung hinzuf&uuml;gen</a
                >
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#">Bonupload</a></li>
              <li><a class="dropdown-item" href="#">Bons zuweisen</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#">Kapitalquellen</a></li>
              <li><a class="dropdown-item" href="#">Vertragspartner</a></li>
              <li>
                <a class="dropdown-item" href="#"
                  >vordefinierte Geldbewegungen</a
                >
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-wrench"></i>
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><a class="dropdown-item" href="#">Kapitalquellen</a></li>
              <li><a class="dropdown-item" href="#">Vertragspartner</a></li>
              <li>
                <a class="dropdown-item" href="#"
                  >vordefinierte Geldbewegungen</a
                >
              </li>
              <li>
                <a class="dropdown-item" href="#">Monatsabschl&uuml;sse</a>
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-asterisk"></i>
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><a class="dropdown-item" href="#">ETF Depot</a></li>
              <li><a class="dropdown-item" href="#">neue ETF Buchung</a></li>
            </ul>
          </li>
        </ul>
        <div class="collapse navbar-collapse dropstart">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                <i class="bi bi-incognito"></i>
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a class="dropdown-item" href="#"
                    >pers&ouml;nliche Einstellungen</a
                  >
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a class="dropdown-item" href="#">Systemeinstellungen</a>
                </li>
                <li><a class="dropdown-item" href="#">Benutzerkonten</a></li>
                <li><a class="dropdown-item" href="#">Benutzergruppen</a></li>
                <li><a class="dropdown-item" href="#">Sprachen</a></li>
                <li><a class="dropdown-item" href="#">Buchungskonten</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#"
                ><i class="bi bi-box-arrow-right"></i
              ></a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
  <main>
    <div style="margin-top: 80px">
      <router-view />
    </div>
  </main>
</template>

<script lang="ts">
import router, { Routes } from "@/router";

export default {
  name: "AppNavigation",

  data() {
    return {
      Routes: Routes,
      router: router,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    };
  },
};
</script>
<style scoped>
.router-link-active {
  background-color: lightgrey;
}
.nav-item {
  padding-left: 15px;
}
small {
  font-size: 0.7rem;
  vertical-align: middle;
}
.navbar .navbar-nav .nav-link {
  font-size: 1.1em;
}
.navbar .navbar-nav .nav-link:hover {
  background-color: silver;
}
a.show {
  background-color: silver;
}
</style>
