import { Map, Overlay } from 'ol';
import PlotPoint, { PlotPointOptions } from './Point';
import { Icon, Style } from 'ol/style';
import EventBus from '../EventEmitter';

interface PlotTextOptions extends PlotPointOptions {
  map: Map;
}

class PlotText extends PlotPoint {
  map: Map | null;

  overlay: Overlay | null;

  textarea: HTMLElement | null;

  constructor({ map, ...restOptions }: PlotTextOptions) {
    super(restOptions);

    // 设置图标
    const style = new Style();
    style.setImage(
      new Icon({
        width: 20,
        height: 20,
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAADGxJREFUeF7tnQmodVUZhl8pSyosM2wezcJs0KSBbFAbbMIGGoiyguaEIhRSopSMksgoKBs0opEmaADLiswCIxLTSouMTJqzwaHJLKjzwQmu97/3rLXfvfd317nr2XD4/59/vevb61n7OWefPZ29xAIBCGxLYC/YQAAC2xNAELYOCKwggCBsHhBAELYBCHgE+ATxuJHqhACCdDLRDNMjgCAeN1KdEECQTiaaYXoEEMTjRqoTAgjSyUQzTI8AgnjcSHVCAEE6mWiG6RFAEI8bqU4IIEgnE80wPQII4nEj1QkBBOlkohmmRwBBPG6kOiGAIJ1MNMP0CCCIx41UJwQQpJOJZpgeAQTxuJHqhACCdDLRDNMjgCAeN1KdEECQTiaaYXoEEMTjRqoTAi0LclNJj9xiHs7vZG526zCP3GZgTc5ry4LcTtIft4B5oqQzduvWs8vH9ThJX5a096ZxXrDNm+GO42hZkIMkXb4NoZdK+tCO02MFhhB48FKO228RukTSYUM6y2rbsiAPkfS9FSCOl3RmFijq2AT2k3ScpFdKOnibXuKN8L52hRmDLQvyeElfK4z9t5LOktTk/uuM87YOXT9c0gMkPWrxaX/Xwgr/RtJdWhxUy4I8Z/GO8+kWobFOkxO4WtJtJ+91gg5bFuTlkj4wwRjpon0CN0jaR9J/W1vVlgV5/QLa6a0BY31mI3ArSX+frXez45YFeZukk8xxEVs/AnF066rWVrtlQd63PPLRGjPWZx4C95R05Txd+722LMinJD3XHxrJNSNwiKQft7bOLQtyrqRjWgPG+sxG4KGSLpytd7PjlgX5rqSHmeMaGvu3pDiSUnpFuymW7a5Hqul7qnM+N5F0sw2vm2/698b/q1mvsW2CybfGdjJ1vmVBfirpPhMN+J+Srljxun6iOjXdfHNxYnOMIEftwInRB0mK16HLP+Pv+9cMdkCbJy/eEL8yoH1K05YF+cPiUpIDRlL4oaSPLV/RXwvLOgqyFbcHSnqMpCctX2PZPlvS58Z2MnW+ZUH+tfzId8b8t0X2rZLiUHFry24RZCPXuJzk5JGivEjSR1ubrFYF2VfStSasy5YXx11s5ueO7UZB/s8s3pRCFGd5laT3O8E5M60KcnfzmHiz9xVsmMTdLEgM8yOL73ovNDbaJu/zaVWQ+BIY9wgMWf60+K5xoKTrhoR2oO1uFySOhp0j6bED2b5J0mkDM7M3b1WQOMoTG9KQ5WWLS6bPHhLYoba7XZDAGje7faPiMveNU/CuxW7163ZoTrYt26ogz5L02QGwvr08ojIgsmNNexAk4L5WUmz0tcsnJL2gtnFWu1YFiS9sQ+4WjHtHhgiVxXerOr0IEmOPE3+ProT9VUlPrGyb1qxVQd4o6c2VFGJ/96mVbVto1pMgxy7uNf9iJfTvSzq8sm1as1YFebek11RSiCMmcTJwXZaeBBnyKfIrSXdrbRJbFeSTkp5XAetni7Ov919eQ1XRvIkmvQkSB08+WEE+Lge6RUW71CatChIPa4iHNpSWt0iK3bF1WnoTJDb6H0i6d8UkxQWSU10QWlGu3KRVQeIseFwYV1riqRmXlho19v+9CRL4T13cb35KxTzEk03iCSfNLK0KEvujpcfArNOh3Y0T3qMgRy/Pi5Q2/Hh43NATxKU+R/1/q4LE/mg85WLVso67VzGeHgWJcccnw50Kc/oESV8ftUVPHG5RkLiR5z8V42wOZsU69yxIzS3Uz1/cAxQHaJpZWhTkDpJ+VyD0+8Uzs+7YDMVhK9LrJ8iLJX24gCouNRly9n0YeaN1i4LEF++40WnV8pk1fqBDr4LEHYhxQemqJS6Xf4OxHc8WaVGQuKX0vMKI1/nB1b0KElP6o+V5q+2mN56zHE/UbGZpUZCaZ/LGMfWfN0Nx2Ir0LEjcEPWKFbi+sDhn8oxhOOdt3aIg8enwnhXDbva3JCqnqmdBSt9DvrM4inVEJceUZi0KUjqp9E5JJ6TQmadIz4KUfvMlLh2a6kk2k8xei4K8d/GM1levGF08TK70uyGTwJmpk54FuaWkkGC7I5DXSIof3GlmaVGQOEIVj4DZavmHpIC8zkvPgsS8xe0J8QyszUv8HmU8uyx+eKeZpUVBVt1qG086eXoz9LwV6V2Qty8vI9r8IL9fejjnTbUoyLwj3vneexdk52dgwBogyABYEzVFkIlAZnSDIBmUb1wDQfKZ2xURxEZnBxHERpcfRJB85giSz9yuiCA2OjuIIDa6/CCC5DNHkHzmdkUEsdHZQQSx0eUHESSfOYLkM7crIoiNzg4iiI0uP4gg+cwRJJ+5XRFBbHR2EEFsdPlBBMlnjiD5zO2KCGKjs4MIYqPLDyJIPnMEyWduV0QQG50dRBAbXX4QQfKZI0g+c7sigtjo7CCC2OjygwiSzxxB8pnbFRHERmcHEcRGlx9EkHzmCJLP3K6IIDY6O4ggNrr8IILkM0eQfOZ2RQSx0dlBBLHR5QcRJJ85guQztysiiI3ODiKIjS4/iCD5zBEkn7ldEUFsdHYQQWx0+UEEyWeOIPnM7YoIYqOzgwhio8sPIkg+cwTJZ25XRBAbnR1EEBtdfhBB8pkjSD5zuyKC2OjsIILY6PKDCJLPHEHymdsVEcRGZwcRxEaXH0SQfOYIks/croggNjo7iCA2uvwgguQzR5B85nZFBLHR2UEEsdHlBxEknzmC5DO3KyKIjc4OIoiNLj+IIPnMESSfuV0RQWx0dhBBbHT5QQTJZ44g+cztighio7ODCGKjyw8iSD5zBMlnbldEEBudHUQQG11+EEHymSNIPnO7IoLY6Owggtjo8oMIks8cQfKZ2xURxEZnBxHERpcfRJB85giSz9yuiCA2OjuIIDa6/CCC5DNHkHzmdkUEsdHZQQSx0eUHESSfOYLkM7crIoiNzg4iiI0uP4gg+cwRJJ+5XRFBbHR2EEFsdPlBBMlnjiD5zO2KCGKjs4MIYqPLDyJIPnMEyWduV0QQG50dRBAbXX4QQfKZI0g+c7sigtjo7CCC2OjygwiSzxxB8pnbFRHERmcHEcRGlx9EkHzmCJLP3K6IIDY6O4ggNrr8IILkM0eQfOZ2RQSx0dlBBLHR5QcRJJ85guQztysiiI3ODiKIjS4/iCD5zBEkn7ldEUFsdHYQQWx0+UEEyWeOIPnM7YoIYqOzgwhio8sPIkg+cwTJZ25XRBAbnR1EEBtdfhBB8pkjSD5zuyKC2OjsIILY6PKDCJLP/AJJjxhR9ihJ54/IEx1AAEEGwJqo6cWSDh3RF4KMgDc0iiBDiY1vf7mkg0Z0gyAj4A2NIshQYuPb/1rSnUd0gyAj4A2NIshQYuPbXy3pNiO6QZAR8IZGEWQosfHtb5C094huEGQEvKFRBBlKbFz7fSVdO64LPU3Sl0b2QbySAIJUgpqo2f0kXTayr+MlnTmyD+KVBBCkEtREzY6RdO7Ivk6XdPLIPohXEkCQSlATNXuJpLNH9vVxSceN7IN4JQEEqQQ1UbNTJZ0ysq84ix5f1FkSCCBIAuQNJS6VdMgEJePL/l8n6IcuCgQQJG8Tieuv4jqsKZZnSvr8FB3Rx2oCCJK3hbxj8a5/wkTl4ihWHM1imZkAgswMeNn90ZLOkbTPROWul/QUSedN1B/dbEMAQebfNA5YXp5+8MSlfrLo90hJV03cL91tIIAg824OIUWctzh2pjJxRv0kSSELywwEEGQGqMtdqfi+ceLICxNr1u4aSfH95oyFLLHrxTIhAQSZDuY9lrs8h0s6QtJh03Vd1VPciBVHyS5a7tJdWZWi0UoCCDJ8AzlQUrzutfwz/h4yhCAtLSHIJZKukPSLDa/4N580lTOFIHuCOm25W3RrSftJ2n/TqxJt082uk/TnDa+/LK8yjt01rvPiS/rKjXfsU0eaNqNi5XjTRBAEWUEAQRAEQRCk4rNUEu8We3JiF6tu2+miFYIgyGYCbBPsYrGLxS5W3Qcg7xZ7coqbmnpeeh//jeYeQXpWgbEXCSBIERENeiaAID3PPmMvEkCQIiIa9EwAQXqefcZeJIAgRUQ06JkAgvQ8+4y9SABBioho0DMBBOl59hl7kQCCFBHRoGcCCNLz7DP2IgEEKSKiQc8EEKTn2WfsRQIIUkREg54JIEjPs8/YiwQQpIiIBj0TQJCeZ5+xFwkgSBERDXomgCA9zz5jLxJAkCIiGvRMAEF6nn3GXiSAIEVENOiZAIL0PPuMvUgAQYqIaNAzAQTpefYZe5HA/wBxg8bYiG5p+AAAAABJRU5ErkJggg==',
      }),
    );
    this.feature.setStyle(style);

    this.map = map;
    this.overlay = null;
    this.textarea = null;

    this.createOverlay();
  }

  /**
   * 创建一个 texarea
   */
  createTextarea() {
    const textarea = document.createElement('div');
    textarea.classList.add('textarea');
    const text = this.feature.get('text');
    if (text) textarea.innerHTML = text.replace(/\n/g, '<br />');
    textarea.autofocus = true;
    textarea.addEventListener('blur', this.handleTextareaChange);
    return textarea;
  }

  /**
   * 创建一个 overlay
   */
  createOverlay() {
    const element = document.createElement('div');
    element.classList.add('ml-plot-text-popup');

    this.textarea = this.createTextarea();
    element.appendChild(this.textarea);

    this.overlay = new Overlay({
      element,
      offset: [12, 0],
      positioning: 'center-left',
      position: this.centerPoint,
    });

    this.map?.addOverlay(this.overlay);
  }

  handleTextareaChange = (e: FocusEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const value = (e.target as HTMLDivElement).innerText;
    this.feature.set('text', value);

    EventBus.emit('modified', this);
  };

  activate() {
    super.activate();

    if (!this.textarea) {
      return;
    }

    this.overlay?.setPosition(this.centerPoint);

    this.textarea.contentEditable = 'true';
    this.textarea.classList.add('active');
    this.textarea.focus();
  }

  deactivate() {
    super.deactivate();

    if (!this.textarea) {
      return;
    }

    this.textarea.contentEditable = 'false';
    this.textarea.classList.remove('active');
  }

  setCenterPoint(center: number[]) {
    super.setCenterPoint(center);
    this.overlay?.setPosition(this.centerPoint);
  }

  destroy() {
    super.destroy();

    if (this.map && this.overlay) this.map.removeOverlay(this.overlay);
    this.map = null;
    this.overlay = null;
    this.textarea?.removeEventListener('blur', this.handleTextareaChange);
    this.textarea = null;
  }
}

export default PlotText;
