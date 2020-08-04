# Quick MP3 data export

This was designed specifically for extracting data from a large group
of conference recordings.  The recordings were all migrated to mp3 files and 
much of the data of each talk was placed in the ID3 tags.

This electron app will open a list of Mp3 files and extract the data from the tags.
It will translate the tags to their relation for a conference talk.  For instance `Artist` => `Speaker`

## Changes

If you want to customize this, just change the `convertTags` function in `app/js/utils.js`
