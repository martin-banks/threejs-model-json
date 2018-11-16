
longforms made up of sections
Sections are defined by the pattern:
  
  promo -- section[data-type=fullscreen]
  text  -- section[data-type=standard].layout-standard


add scripts/styles to page

Add static / video graphics as promos - these will act as a fall back for non-longforms or no wbgl support
if longform is detected
  -- hide parallax images / change their inner html if required
  -- use these section progression to update models

add / remove models



z-index
The longform sections have enforced z-indexes to force editorial content to render above 'parallax' images/promos. therefore the model will render above the promo content unless additional css rules are written to correct this