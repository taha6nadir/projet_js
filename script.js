 localStorage.clear();
    let activites = [];
    $(document).ready(function () {
      $.ajax({
        url: "activites.json",
        method: "GET",
        dataType: "json",
        success: function (data) {
          if (localStorage.getItem("activites")) {
            activites = JSON.parse(localStorage.getItem("activites"));
          } else {
            activites = data;
            localStorage.setItem(
              "activites",
              JSON.stringify(activites)
            );
          }
          afficherActivites(activites);
          statistiques();
        }
      });
      $("#recherche").on("keyup", filtrer);
      $("#dateRecherche").on("change", filtrer);
      $("#filtre").on("change", filtrer);

    });
    function getIcon(type) {
      const icons = { Sport: '🏃', Eau: '💧', Sommeil: '😴' };
      return icons[type] || '📋';
    }
    function getColor(type) {
      const colors = { Sport: '#00f0ff', Eau: '#39ff14', Sommeil: '#ff6b35' };
      return colors[type] || '#8888a0';
    }
    function afficherActivites(data) {
      $("#activites").html("");
      data.forEach(function (act, i) {
        let recent = "";
        let aujourdHui = new Date();
        let dateAct = new Date(act.date);
        let diff =
          (aujourdHui - dateAct) /
          (1000 * 60 * 60 * 24);
        if (diff <= 7) {
          recent = '<span class="badge">✦ Récent</span>';
        }
        $("#activites").append(`
            <div class="carte" style="animation-delay:${i * 0.08}s">
                <h3>${getIcon(act.type)} ${act.type}</h3>
                ${recent}
                <p>Quantité : ${act.duree} ${act.unite}</p>
                <p>Date : ${act.date}</p>
                <button
                    class="btn"
                    onclick="supprimer(${act.id})">
                    ✕ Supprimer
                </button>
            </div>
        `);
      });
    }
    function filtrer() {
      let type = $("#filtre").val();
      let recherche =
        $("#recherche").val().toLowerCase();
      let date =
        $("#dateRecherche").val();
      let resultat = activites.filter(function (act) {
        let okType =
          type === "Tous" ||
          act.type === type;
        let okRecherche =
          act.type.toLowerCase()
            .includes(recherche);
        let okDate =
          date === "" ||
          act.date === date;
        return okType &&
          okRecherche &&
          okDate;
      });
      afficherActivites(resultat);
    }
    function supprimer(id) {
      activites =
        activites.filter(
          a => a.id !== id
        );
      localStorage.setItem(
        "activites",
        JSON.stringify(activites)
      );
      afficherActivites(activites);
      statistiques();
    }
    function animatevalue($el, start, end, duration,formater) {
      const range = end - start;
      const startTime = performance.now();
      function step(now){
        const progress = Math.min(1,(now - startTime) / duration);
        const value = start + range * progress;
        $el.text(formater(value));
        if(progress < 1) requestAnimationFrame(step);
        
      }
      requestAnimationFrame(step);
    }
    function statistiques() {
      animatevalue($("#totalActivites"), 0, activites.length, 800, v => Math.round(v));
      let sport = 0;
      let eau = 0;
      activites.forEach(function (act) {
        if (act.type === "Sport") {
          sport += Number(act.duree);
        }
        if (act.type === "Eau") {
          eau += Number(act.duree);
        }
      });
      animatevalue($("#totalSport"), 0, sport, 800, v => Math.round(v) + " min");
      animatevalue($("#totalEau"), 0, eau, 800, v => v.toFixed(1) + " L");
    }