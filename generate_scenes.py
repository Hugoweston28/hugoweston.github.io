from pathlib import Path

root = Path(__file__).resolve().parent

scenes = {
    "scene-1.svg": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#101d2e"/>
      <stop offset="55%" stop-color="#273d58"/>
      <stop offset="100%" stop-color="#eecdb7"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#sky)"/>
  <circle cx="1180" cy="230" r="130" fill="#f9d3a5" opacity="0.75"/>
  <path d="M0 610C160 500 240 470 340 510C470 560 520 620 630 610C760 598 840 470 960 470C1080 470 1170 620 1320 610C1440 604 1535 560 1600 520V1000H0Z" fill="#19324d" opacity="0.9"/>
  <path d="M0 700C170 660 260 690 360 740C500 810 630 808 760 740C892 672 1050 660 1160 710C1270 760 1400 760 1600 700V1000H0Z" fill="#10283d" opacity="0.9"/>
  <path d="M880 360C930 330 986 320 1038 336C1072 348 1108 372 1136 410C1164 444 1184 474 1200 508C1172 515 1144 520 1116 520C1034 520 960 490 900 446C885 433 846 392 880 360Z" fill="#efd7c5" opacity="0.65"/>
  <path d="M870 500C910 455 972 420 1044 420C1116 420 1185 455 1226 520C1248 552 1262 590 1266 630C1210 642 1150 648 1088 648C1016 648 948 634 890 604C862 590 831 556 870 500Z" fill="#f7f0ec" opacity="0.75"/>
  <g fill="#f5e8dc" opacity="0.65">
    <circle cx="350" cy="240" r="64"/>
    <circle cx="430" cy="200" r="46"/>
    <circle cx="504" cy="246" r="38"/>
  </g>
</svg>
''',
    "scene-2.svg": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0d1d2f"/>
      <stop offset="52%" stop-color="#2c4d6a"/>
      <stop offset="100%" stop-color="#9dc4d8"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#sky)"/>
  <circle cx="1210" cy="200" r="120" fill="#f8f5ef" opacity="0.8"/>
  <path d="M0 660C160 620 230 610 300 634C406 669 456 740 552 740C662 740 742 664 820 640C944 606 1028 622 1130 688C1228 750 1360 766 1600 700V1000H0Z" fill="#183e58" opacity="0.9"/>
  <path d="M0 760C180 720 294 724 420 760C552 798 662 806 778 782C910 756 1012 712 1144 730C1280 750 1428 804 1600 776V1000H0Z" fill="#0b2b43" opacity="0.95"/>
  <g fill="none" stroke="#dfefff" stroke-width="4" opacity="0.7">
    <path d="M0 760C190 730 330 760 520 790C700 820 860 820 1040 780C1224 740 1382 744 1600 780"/>
    <path d="M0 820C180 792 340 820 520 852C700 884 864 884 1044 846C1234 808 1388 814 1600 848"/>
  </g>
  <g fill="#e8f4ff" opacity="0.65">
    <circle cx="260" cy="230" r="44"/>
    <circle cx="330" cy="210" r="30"/>
    <circle cx="398" cy="236" r="52"/>
  </g>
</svg>
''',
    "scene-3.svg": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fbd7a2"/>
      <stop offset="48%" stop-color="#f6bc7a"/>
      <stop offset="100%" stop-color="#ebefe9"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#sky)"/>
  <circle cx="1206" cy="220" r="150" fill="#fff1cf" opacity="0.82"/>
  <path d="M0 600C144 560 204 560 294 600C414 654 500 660 600 620C738 566 856 540 996 566C1152 594 1290 662 1462 650C1528 646 1572 636 1600 628V1000H0Z" fill="#d88b57" opacity="0.82"/>
  <path d="M0 690C168 654 278 678 390 704C540 738 628 752 748 734C920 710 1038 646 1174 652C1314 660 1438 724 1600 714V1000H0Z" fill="#c16641" opacity="0.8"/>
  <g fill="#fff9ef" opacity="0.72">
    <circle cx="300" cy="220" r="58"/>
    <circle cx="380" cy="190" r="34"/>
    <circle cx="466" cy="230" r="42"/>
  </g>
</svg>
''',
    "scene-4.svg": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#dfeeff"/>
      <stop offset="55%" stop-color="#c4dff7"/>
      <stop offset="100%" stop-color="#edf6ff"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#sky)"/>
  <circle cx="1218" cy="180" r="120" fill="#fffef9" opacity="0.78"/>
  <path d="M0 610C118 572 204 520 310 540C420 560 478 642 574 650C702 662 768 560 868 536C992 508 1048 538 1166 610C1260 666 1402 686 1600 660V1000H0Z" fill="#9bbad3" opacity="0.8"/>
  <path d="M0 720C182 700 282 714 390 744C528 780 652 790 806 760C966 728 1100 666 1238 672C1348 676 1452 720 1600 712V1000H0Z" fill="#7ea5c6" opacity="0.85"/>
  <g fill="#ffffff" opacity="0.7">
    <ellipse cx="260" cy="250" rx="150" ry="46"/>
    <ellipse cx="470" cy="270" rx="120" ry="40"/>
    <ellipse cx="690" cy="240" rx="180" ry="52"/>
  </g>
</svg>
''',
    "scene-5.svg": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8bd1ff"/>
      <stop offset="56%" stop-color="#dff8ff"/>
      <stop offset="100%" stop-color="#f5fff4"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#sky)"/>
  <circle cx="1244" cy="200" r="124" fill="#fff5d1" opacity="0.78"/>
  <g fill="#ffffff" opacity="0.7">
    <ellipse cx="270" cy="260" rx="160" ry="54"/>
    <ellipse cx="470" cy="238" rx="126" ry="40"/>
    <ellipse cx="700" cy="290" rx="170" ry="52"/>
    <ellipse cx="1060" cy="278" rx="190" ry="56"/>
  </g>
  <path d="M0 620C176 578 258 560 352 584C514 628 600 714 778 692C916 676 992 592 1118 566C1260 538 1420 574 1600 624V1000H0Z" fill="#bfe3ef" opacity="0.8"/>
  <path d="M0 720C200 686 312 704 430 742C580 786 654 806 810 784C980 762 1118 692 1262 704C1404 716 1498 762 1600 760V1000H0Z" fill="#73adc5" opacity="0.72"/>
</svg>
''',
    "scene-6.svg": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#dfe9fb"/>
      <stop offset="58%" stop-color="#c7d9f4"/>
      <stop offset="100%" stop-color="#eef7ff"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#sky)"/>
  <circle cx="1200" cy="220" r="160" fill="#f8f4e8" opacity="0.84"/>
  <g fill="#ffffff" opacity="0.76">
    <ellipse cx="300" cy="268" rx="180" ry="56"/>
    <ellipse cx="542" cy="242" rx="146" ry="46"/>
    <ellipse cx="820" cy="286" rx="190" ry="62"/>
    <ellipse cx="1170" cy="272" rx="200" ry="58"/>
  </g>
  <path d="M0 610C170 598 258 566 366 606C496 654 602 654 734 612C878 568 950 538 1088 570C1228 602 1382 680 1600 648V1000H0Z" fill="#a9c2d6" opacity="0.8"/>
  <path d="M0 716C182 674 290 684 420 730C560 780 648 802 776 784C910 766 1038 690 1180 694C1320 698 1458 754 1600 738V1000H0Z" fill="#7e9fc0" opacity="0.76"/>
</svg>
'''
}

for name, svg in scenes.items():
    (root / name).write_text(svg, encoding='utf-8')

print(f'Generated {len(scenes)} SVG scene files in {root}')
