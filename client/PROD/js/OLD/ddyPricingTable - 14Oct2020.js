<style type="text/css">
  html {
  box-sizing: border-box;
  font-family: 'Open Sans', sans-serif;
}

*, *:before, *:after {
  box-sizing: inherit;
}

.background {
  padding: 0 25px 25px;
  position: relative;
  width: 100%;
  color: black;
}

.background::after {
  content: '';
  background: #800000;
  background: -moz-linear-gradient(top, #800000 0%, #A52A2A 100%);
  background: -webkit-linear-gradient(top, #800000 0%,#A52A2A 100%);
  background: linear-gradient(to bottom, #800000 0%,#A52A2A 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#800000', endColorstr='#A52A2A',GradientType=0 );
  height: 350px;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
}

@media (min-width: 900px) {
  .background {
    padding: 0 0 25px;
  }
}

.container {
  margin: 0 auto;
  padding: 50px 0 0;
  max-width: 1080px;
  width: 100%;
  text-align: center;
}

.panel {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px 15px;
  position: relative;
  width: 100%;
  z-index: 10;
}

.pricing-table {
  box-shadow: 0px 10px 13px -6px rgba(0, 0, 0, 0.08), 0px 20px 31px 3px rgba(0, 0, 0, 0.09), 0px 8px 20px 7px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
}

@media (min-width: 900px) {
  .pricing-table {
    flex-direction: row;
  }
}

.pricing-table * {
  text-align: center;
  text-transform: uppercase;
}

.pricing-plan {
  border-bottom: 1px solid #800000;
  padding: 10px;
}

.pricing-plan:last-child {
  border-bottom: none;
}

@media (min-width: 900px) {
  .pricing-plan {
    border-bottom: none;
    border-right: 1px solid #e9e9e9;
    flex-basis: 100%;
    padding: 25px 50px;
  }

  .pricing-plan:last-child {
    border-right: none;
  }
}

.pricing-img {
  margin-bottom: 1px;
  height: 250px;
  max-width: 100%;
  object-fit: cover;
}

.pricing-header {
  height: 60px;
  padding: 1px;
  color: #888;
  font-weight: 600;
  letter-spacing: 1px;
}

.pricing-header-gold {
  height: 60px;
  padding: 1px;
  color: goldenrod;
  font-weight: 600;
  letter-spacing: 1px;
}  
 
.pricing-features {
  min-height: 150px;
  color: #800000;
  font-weight: 600;
  letter-spacing: 1px;
  margin: 40px 0 5px;
}

.pricing-features-item {
  border-top: 1px solid #e9e9e9;
  font-size: 12px;
  line-height: 1.5;
  padding: 10px;
  text-align: left;
}

.pricing-features-item:last-child {
  border-bottom: 1px solid #e9e9e9;
}

.pricing-price-block {
  min-height: 150px;
  padding: 5px;
}
 
.pricing-price {
  color: #800000;
  display: inline;
  font-size: 32px;
  font-weight: 700;
}

.pricing-price-monthly {
  color: #800000;
  display: block;
  font-size: 24px;
  font-weight: 700;
}

.pricing-price-medium {
  display: inline;
  font-size: 20px;
  font-weight: 600;  
}

.pricing-price-medium-promo {
  display: inline;
  font-size: 24px;
  font-weight: 800;
  color: red;
}

.pricing-price-small {
  color: grey;
  display: inline;
  font-size: 12px;
  font-weight: 500;  
}
  
.pricing-button {
  background-color: #fff !important;
  border: 1px solid #800000 !important;
  border-radius: 10px !important;
  color: #800000 !important;
  display: inline-block !important;
  margin: 5px 0 !important;
  padding: 10px 20px !important;
  text-decoration: none !important;
  transition: all 150ms ease-in-out !important;
}

.pricing-button:hover,
.pricing-button:focus {
  background-color: #800000 !important;
  color: #fff !important;
}

.pricing-button-gold {
  background-color: #fff !important;
  border: 1px solid #800000 !important;
  border-radius: 10px !important;
  color: #800000 !important;
  display: inline-block !important;
  margin: 10px 0 !important;
  padding: 10px 20px !important;
  text-decoration: none !important;
  transition: all 150ms ease-in-out !important;
}

.pricing-button-gold:hover,
.pricing-button-gold:focus {
  background-color: goldenrod !important;
  border: goldenrod !important;
  color: #fff !important;
}  
  
.pricing-button.is-featured {
  background-color: #800000 !important;
  color: #fff !important;
}

.pricing-button.is-featured-gold {
  background-color: #800000 !important;
  color: #fff !important;
}
  
.pricing-button.is-featured:hover,
.pricing-button.is-featured:active {
  background-color: #fff !important;
  color: #800000 !important;
}
 
.pricing-button.is-featured-gold:hover,
.pricing-button.is-featured-gold:active {
  background-color: goldenrod !important;
  border: goldenrod !important;
  color: white !important;
}

/* PRICING PLAN TOGGLE CSS */

.b {
  display: block;  
}

.check {
  position: absolute;
  display: block;
  cursor: pointer;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 6;
}

.check:checked ~ .switch {
  right: 2px;
  left: 57.5%;
  transition: 0.25s cubic-bezier(0.785, 0.135, 0.15, 0.86);
  transition-property: left, right;
  transition-delay: .08s, 0s;  
}

label { 
  display: block; 
  padding: 5px;
  margin: 0 0 5px;
  border-radius: 5px;
}

label:hover {
  background: ghostwhite;
  color: goldenrod;
  cursor: pointer;
}

.pricing-toggle {
  background-color: white;  
}

.switch {
  position: absolute;
  left: 2px;
  top: 2px;
  bottom: 2px;
  right: 57.5%;
  background-color: maroon;
  border-radius: 36px;
  z-index: 1;
  transition: 0.25s cubic-bezier(0.785, 0.135, 0.15, 0.86);
  transition-property: left, right;
  transition-delay: 0s, .08s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.toggle, .toggler {
  display: inline-block;  
  vertical-align: middle;
  margin: 2px;  
}

.toggler {  
  color: gray;
  transition: .2s;
  font-weight: bold;
  position: relative;
  z-index: 999;
}

.toggle {
  position: relative;
  width: 80px;
  height: 35px;
  border-radius: 100px;
  background-color: white;
  overflow: hidden;
  box-shadow: inset 0 0 2px 1px rgba(0, 0, 0, 0.05);
  z-index: 9999;
}

.toggler--is-active {  
  color: white;
  position: relative;
  z-index: 999;
}

.white {
  color: white !important;
}

/* CUSTOM CSS */
  
.fancy-strike {
      color: grey;
      position: relative;
      /*font-size: 28px;*/
      font-weight: 400;
      }

.fancy-strike::after {
      content: '';
      position: absolute;
      left: 0;
      top: 45%;
      /* -webkit-transform: rotate(45deg); */
      height: 4px;
      width: 100%;
      background: red;
      }

hr {
  border-top: 1px solid #e9e9e9;  
}

.hide {
  display: none;
}
</style>
  
<div class="background">
  <div class="container">

    <!-- PRICING PLAN TOGGLER -->    
    <label class="toggler toggler--is-active" id="filt-yearly">....Yearly..年卡....</label>      
    <div class="toggle">
      <input type="checkbox" id="switcher" class="check">
      <b class="b switch"></b>
    </div>
    <label class="toggler" id="filt-monthly">....Monthly..月卡....</label>
    
    <div class="panel pricing-table">
      <!-- SILVER PLAN -->
      <div class="pricing-plan">
        <img src="https://sophiadance.squarespace.com/s/ddy-silver-image-small.jpg" alt="" class="pricing-img">
        <h2 class="pricing-header">....Silver Member..银卡会员....</h2>
        <ul class="pricing-features">
          <li class="pricing-features-item">....Enjoy up to 18 amazing Dance and Yoga Classes per month (Not including Aerial Yoga)..享受舞蹈和地面类瑜伽课多达18课（不包括空中瑜伽）....</li>
          <li class="pricing-features-item">....Yearly discount available!..年卡特价折扣....</li>
        </ul>
        <!-- YEARLY PRICING -->
        <div class="pricing-price-block yearly-text">
          <div class="pricing-price-block">
            <a class="pricing-price"><span class="fancy-strike">$199</span><br>$166<span class="pricing-price-small">.... / mo.. / 月....<br>....Total $1,999 billed annually..每年支付 $1,699....<br></span></a>
            <a href="https://app.acuityscheduling.com/catalog.php?owner=15731779&action=addCart&clear=1&id=905611" target="_blank" class="acuity-embed-button pricing-button is-featured">....Buy Now..购买年卡....</a>
          </div>
        </div>
        <!-- MONTHLY PRICING -->
        <div class="monthly-text hide">
          <div class="pricing-price-block">
            <a class="pricing-price">$199<span class="pricing-price-small">.... / mo.. / 月....<br>....6 Months Minimum Commitment..最少承诺6个月....<br></span></a>          
            <a href="https://app.acuityscheduling.com/catalog.php?owner=15731779&action=addCart&clear=1&id=905606" target="_blank" class="acuity-embed-button pricing-button">....Buy Now..购买年卡....</a>
          </div>
        </div>
      </div>

      <!-- GOLD PLAN -->
      <div class="pricing-plan">
        <img src="https://sophiadance.squarespace.com/s/ddy-gold-image-small.jpg" alt="" class="pricing-img">
        <h2 class="pricing-header-gold">....Gold Member..金卡会员....</h2>
        <ul class="pricing-features">
          <li class="pricing-features-item">....Our Best Deal! Enjoy up to 25 amazing Dance, Yoga, and Aerial Classes per month!..最受欢迎的课程！每月最多可享受25堂舞蹈，包含所有舞蹈类和所有瑜伽类课程！....</li>
          <li class="pricing-features-item">....Yearly discount available!..年卡特价折扣....</li>
        </ul>
        <!-- YEARLY PRICING -->
        <div class="yearly-text">
          <div class="pricing-price-block">
            <a class="pricing-price"><span class="fancy-strike">$239</span><br>$199<span class="pricing-price-small">.... / mo.. / 月....<br>....Total $2,399 billed annually..每年支付 $2,399....<br></span></a>
            <a href="https://app.acuityscheduling.com/catalog.php?owner=15731779&action=addCart&clear=1&id=905610" target="_blank" class="acuity-embed-button pricing-button is-featured-gold">....Buy Now..购买年卡....</a>
          </div>
        </div>
        <!-- MONTHLY PRICING -->
        <div class="monthly-text hide">
          <div class="pricing-price-block">
            <a class="pricing-price">$239<span class="pricing-price-small">.... / mo.. / 月....<br>....6 Months Minimum Commitment..最少承诺6个月....<br></span></a>
            <a href="https://app.acuityscheduling.com/catalog.php?owner=15731779&action=addCart&clear=1&id=905608" target="_blank" class="acuity-embed-button pricing-button-gold">....Buy Now..购买年卡....</a>
          </div>          
        </div>
      </div>

      <!-- PACKAGE -->
      <div class="pricing-plan">
        <img src="https://sophiadance.squarespace.com/s/ddy-dance-yoga-pkg-small.jpg" alt="" class="pricing-img">
        <h2 class="pricing-header">....Dance and Yoga Package..舞蹈和瑜伽课程配套....</h2>
        <ul class="pricing-features">
          <li class="pricing-features-item">....Enjoy our Dance, Yoga, and Aerial classes with no commitment!..肚皮舞，瑜伽和空中瑜伽课程....</li>
          <li class="pricing-features-item">....Use anytime within the validity period..在有效期内随时使用....</li>
        </ul>
        <!-- 16 CLASS -->
        <div class="yearly-text">
          <div class="pricing-price-block">
            <a class="pricing-price pricing-price-medium">....16 Classes $419..16节课程 $419....<br><span class="pricing-price-small">....Good for 4 months..4个月有效期....<br></span>....8 Classes $259..8节课程 $259....<br><span class="pricing-price-small">....Good for 2 months..2个月有效期....<br></span></a>
            <a href="https://app.acuityscheduling.com/catalog.php?owner=15731779&action=addCart&clear=1&id=905653" target="_blank" class="acuity-embed-button pricing-button is-featured">....16 Class..16课程....</a>
            <a href="https://app.acuityscheduling.com/catalog.php?owner=15731779&action=addCart&clear=1&id=905655" target="_blank" class="acuity-embed-button pricing-button is-featured">....8 Class..8课程....</a>
          </div>
        </div>
        <!-- 8 CLASS -->
        <div class="monthly-text hide">
          <div class="pricing-price-block">
            <a class="pricing-price pricing-price-medium">....16 Classes $419..16节课程 $419....<br><span class="pricing-price-small">....Good for 4 months..4个月有效期....<br></span>....8 Classes $259..8节课程 $259....<br><span class="pricing-price-small">....Good for 2 months..2个月有效期....<br></span></a>
            <a href="https://app.acuityscheduling.com/catalog.php?owner=15731779&action=addCart&clear=1&id=905653" target="_blank" class="acuity-embed-button pricing-button">....16 Class..16课程....</a>
            <a href="https://app.acuityscheduling.com/catalog.php?owner=15731779&action=addCart&clear=1&id=905655" target="_blank" class="acuity-embed-button pricing-button">....8 Class..8课程....</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script type="text/javascript">
  var $yearlyFilter = $('#filt-yearly'),
      $monthlyFilter = $('#filt-monthly'),
      $switcher = $('#switcher'),
      $yearlyText = $('.yearly-text'),
      $monthlyText = $('.monthly-text');

  $yearlyFilter.on('click', function() {
    $switcher.prop('checked', false);
    $yearlyFilter.addClass('toggler--is-active');
    $monthlyFilter.removeClass('toggler--is-active');
    $yearlyText.removeClass('hide');
    $monthlyText.addClass('hide');
  });

  $monthlyFilter.on('click', function() {
    $switcher.prop('checked', true);
    $monthlyFilter.addClass('toggler--is-active');
    $yearlyFilter.removeClass('toggler--is-active');
    $monthlyText.removeClass('hide');
    $yearlyText.addClass('hide');
  });

  $switcher.on('click', function() {
    $monthlyFilter.toggleClass('toggler--is-active');
    $yearlyFilter.toggleClass('toggler--is-active');
    $monthlyText.toggleClass('hide');
    $yearlyText.toggleClass('hide');
  })
</script>
<script src="https://embed.acuityscheduling.com/embed/button/15731779.js" async></script>