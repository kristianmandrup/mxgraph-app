export class Link {
  /**
   * Inserts the given image at the cursor in a content editable text box using
   * the insertimage command on the document instance.
   */
  insertLink(value)
  {
    if (this.cellEditor.textarea != null)
    {
      if (value.length == 0)
      {
        document.execCommand('unlink', false);
      }
      else if (mxClient.IS_FF)
      {
        // Workaround for Firefox that adds a new link and removes
        // the href from the inner link if its parent is a span is
        // to remove all inner links inside the new outer link
        var tmp = this.cellEditor.textarea.getElementsByTagName('a');
        var oldLinks = [];
        
        for (var i = 0; i < tmp.length; i++)
        {
          oldLinks.push(tmp[i]);
        }
        
        document.execCommand('createlink', false, mxUtils.trim(value));
        
        // Finds the new link element
        var newLinks = this.cellEditor.textarea.getElementsByTagName('a');
        
        if (newLinks.length == oldLinks.length + 1)
        {
          // Inverse order in favor of appended links
          for (var i = newLinks.length - 1; i >= 0; i--)
          {
            if (newLinks[i] != oldLinks[i - 1])
            {
              // Removes all inner links from the new link and
              // moves the children to the inner link parent
              var tmp = newLinks[i].getElementsByTagName('a');
              
              while (tmp.length > 0)
              {
                var parent = tmp[0].parentNode;
                
                while (tmp[0].firstChild != null)
                {
                  parent.insertBefore(tmp[0].firstChild, tmp[0]);
                }
                
                parent.removeChild(tmp[0]);
              }
              
              break;
            }
          }
        }
      }
      else
      {
        // LATER: Fix inserting link/image in IE8/quirks after focus lost
        document.execCommand('createlink', false, mxUtils.trim(value));
      }
    }
  };
}