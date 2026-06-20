'use strict';

// IE11 polyfill for picture element
import 'picturefill';

import ViewportService from '@/modules/services/ViewportService';
import ScrollService from '@/modules/services/ScrollService';
import OutsideClickService from '@/modules/services/OutsideClickService';
import EscStackService from '@/modules/services/EscStackService';
import FocusNavigation from '@/modules/services/FocusNavigation';

import Preloader from '@/modules/ui/Preloader';
import SkipToContent from '@/modules/ui/SkipToContent';
import Notify from '@/modules/ui/Notify';
import Header from '@/modules/ui/Header';
import Menu from '@/modules/ui/Menu';
import LangMenu from '@/modules/ui/LangMenu';
import Cookies from '@/modules/ui/Cookies';

import HeaderColorSwitcher from '@/modules/features/HeaderColorSwitcher';
import LangSwitcher from '@/modules/features/LangSwitcher';
import ImagesRotation from '@/modules/features/ImagesRotation';
import Sliders from '@/modules/features/Sliders/index';
import ScrollIntoView from '@/modules/features/ScrollIntoView';
import AnimateOnScroll from '@/modules/features/AnimateOnScroll';
import Parallax from '@/modules/features/Parallax';

var scrollService = new ScrollService();
var outsideClickService = new OutsideClickService();
var escStackService = new EscStackService();
var focusNavigation = new FocusNavigation();

var langSwitcher = new LangSwitcher();

var langMenu = new LangMenu(langSwitcher, {
  outsideClickService: outsideClickService,
  escStackService: escStackService,
});

var header = new Header({
  scrollService: scrollService,
});

new Preloader(header.logo);
var lang = langSwitcher.changeLanguage();
langMenu.updateLanguageUI(lang);

var viewportService = new ViewportService(header);
header.viewportService = viewportService;
header.init();

new SkipToContent();
new Notify();
var menu = new Menu({
  outsideClickService: outsideClickService,
  escStackService: escStackService,
  focusNavigation: focusNavigation,
});
new Cookies();

var headerColorSwitcher = new HeaderColorSwitcher(header, {
  scrollService: scrollService,
  viewportService: viewportService,
});

var imagesRotation = new ImagesRotation(scrollService, viewportService);
var sliders = new Sliders({
  viewportService: viewportService,
  scrollService: scrollService,
});
new ScrollIntoView(menu, { viewportService: viewportService });

var parallax = new Parallax(scrollService, viewportService);
var animateOnScroll = new AnimateOnScroll({
  viewportService: viewportService,
  scrollService: scrollService,
});

scrollService.register(header);
scrollService.register(headerColorSwitcher);
scrollService.register(imagesRotation);
scrollService.register(sliders);
scrollService.register(animateOnScroll);
