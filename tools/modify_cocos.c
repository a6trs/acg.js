#include <stdio.h>
#include <string.h>
#include <stdlib.h>

char *str_replace(char *, char *, char *);
void usage();

static const char *SET_GET_NORMPOS_X_Y = "\
    getNormalizedPositionX: function () {\n\
        return this._normalizedPosition.x;\n\
    },\n\
    setNormalizedPositionX: function (x) {\n\
        this._normalizedPosition.x = x;\n\
        this.setNodeDirty();\n\
    },\n\
    getNormalizedPositionY: function () {\n\
        return this._normalizedPosition.y;\n\
    },\n\
    setNormalizedPositionY: function (y) {\n\
        this._normalizedPosition.y = y;\n\
        this.setNodeDirty();\n\
    },\n";

static const char *ACTION_SECT_BEGIN_MARK =
    "//////////////// ACTIONS BEGIN ////////////////\n";
static const char *ACTION_SECT_END_MARK =
    "//////////////// ACTIONS END ////////////////\n";

int main()
{
    FILE *in = fopen("cocos2d-js-v3.1.js", "r");
    FILE *out = fopen("cocos2d-js-v3.1.modified.js", "w");
    if (!in) { usage(); return 0; }
    char s[1024];
    unsigned short add_normpos = 1;
    /* 0: Not entered; 1: Entered; 2: Left */
    unsigned short actions_sect = 0;
    while (1) {
        fgets(s, 1024, in);
        if (feof(in)) break;
        if (add_normpos &&
                strcmp(s, "    getChildrenCount: function () {\n") == 0) {
            fputs(SET_GET_NORMPOS_X_Y, out);
            add_normpos = 0;
        } else if (actions_sect == 0 &&
                strcmp(s, "cc.ActionManager = cc.Class.extend({\n") == 0) {
            fputs(ACTION_SECT_BEGIN_MARK, out);
            actions_sect = 1;
        } else if (actions_sect == 1) {
            char c = s[19]; s[19] = 0;
            unsigned short r = strcmp(s, "cc.cardinalSplineAt") == 0;
            s[19] = c;
            if (r) {
                fputs(ACTION_SECT_END_MARK, out);
                actions_sect = 2;
            } else {
                char *ss = str_replace(s, "etPosition", "etNormalizedPosition");
                fputs(ss, out);
                free(ss); continue;
            }
        }
        fputs(s, out);
    }
    fclose(in); fclose(out);
    printf("A fresh new Cocos2d-HTML5 modified edition\n");
    printf("is generated in this program's folder. Have fun!\n");
    return 0;
}

// http://stackoverflow.com/q/779875
// You must free the result if result is non-NULL.
char *str_replace(char *orig, char *rep, char *with) {
    char *result; // the return string
    char *ins;    // the next insert point
    char *tmp;    // varies
    int len_rep;  // length of rep
    int len_with; // length of with
    int len_front; // distance between rep and end of last rep
    int count;    // number of replacements

    if (!orig)
        return NULL;
    if (!rep)
        rep = "";
    len_rep = strlen(rep);
    if (!with)
        with = "";
    len_with = strlen(with);

    ins = orig;
    for (count = 0; (tmp = strstr(ins, rep)); ++count) {
        ins = tmp + len_rep;
    }

    // first time through the loop, all the variable are set correctly
    // from here on,
    //    tmp points to the end of the result string
    //    ins points to the next occurrence of rep in orig
    //    orig points to the remainder of orig after "end of rep"
    tmp = result = malloc(strlen(orig) + (len_with - len_rep) * count + 1);

    if (!result)
        return NULL;

    while (count--) {
        ins = strstr(orig, rep);
        len_front = ins - orig;
        tmp = strncpy(tmp, orig, len_front) + len_front;
        tmp = strcpy(tmp, with) + len_with;
        orig += len_front + len_rep; // move to next "end of rep"
    }
    strcpy(tmp, orig);
    return result;
}

void usage()
{
    printf("*** Cocos2d-HTML5 modifier for ACG.JS ***\n");
    printf("*** FOR UPDATE USE ***\n\n");
    printf("This program modifies the downloaded Cocos2d-HTML5 file\n");
    printf("to fit the need of ACG.JS.\n\n");
    printf("What does it do:\n");
    printf("  1. Adds methods for getting/setting normalized position\n");
    printf("     values by only X or Y fields.\n");
    printf("  2. Marks the beginning and the ending of the actions section.\n");
    printf("  3. Replace get/setPosition[X/Y]() calls in all actions\n");
    printf("     with get/setNormalizedPosition[X/Y]() calls.\n\n");
    printf("After you downloaded Javascript file for Cocos2d-HTML5,\n");
    printf("Place the file [cocos2d-js-v3.1.js]\n");
    printf("in the same folder as this program and run it.\n\n");
}
