<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:fo="http://www.w3.org/1999/XSL/Format">
<xsl:output indent="yes"/>

<xsl:key name="idVar" match="Var" use="@id"/>

<xsl:template match="/">

    <fo:root xmlns:fo="http://www.w3.org/1999/XSL/Format">
      <fo:layout-master-set>
        <fo:simple-page-master master-name="doc"
					 margin-top="0.5in"
					 margin-bottom="0.5in" 
					 margin-left="0.5in" 
					 margin-right="0.5in">
          <fo:region-body/>
	    <fo:region-after/>
        </fo:simple-page-master>
      </fo:layout-master-set>

      <fo:page-sequence master-reference="doc" initial-page-number="1" >

	  <fo:static-content flow-name="xsl-region-after">
          <fo:block><fo:page-number/></fo:block>
        </fo:static-content>
        <fo:flow flow-name="xsl-region-body">

          <xsl:apply-templates select="//Algorithm"/>

        </fo:flow>
      </fo:page-sequence>
    </fo:root>
</xsl:template>


<xsl:template match="Algorithm">
      
	<xsl:apply-templates/>
	
</xsl:template>


<xsl:template match="Procedure">

	<xsl:if test="./@PreCondition!='' ">
	<fo:block font-size="18pt" font-family="serif" line-height="20pt">	
	//precondition:&#160;<xsl:value-of select="@PreCondition"/>
	</fo:block>
	</xsl:if>
	
	<xsl:if test="./@PostCondition!='' ">
	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
	//postcondition:&#160;<xsl:value-of select="@PostCondition"/>
	</fo:block>
	</xsl:if>

	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
        <fo:inline font-weight="bold">
	  Procedure&#160;<xsl:value-of select="@id"/>
	  </fo:inline>
	  (&#160;
	
	  <xsl:for-each select="ParamDecl/Param">
		 <xsl:value-of select="@Status"/>&#160; 
		 <xsl:value-of select="@id"/>:
	       <xsl:value-of select="@Type"/>

		 <xsl:if test="position() != last()">
               <xsl:text>,  </xsl:text>
             </xsl:if>
        </xsl:for-each>
	  )
	</fo:block>

	<xsl:if test="./@Comment!='' ">
	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
	//&#160;<xsl:value-of select="@Comment"/>
	</fo:block>
	</xsl:if>

	<xsl:apply-templates select="LocVarDecl"/>

	<fo:block font-size="18pt" font-family="serif" line-height="20pt" font-weight="bold">
	  d&#233;but
	</fo:block>

	<xsl:apply-templates select="Code"/>
	
	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
	  <fo:inline font-weight="bold">
	  fin </fo:inline>
	  {<xsl:value-of select="@id"/>}
	</fo:block>

	<fo:block font-size="18pt" font-family="serif" line-height="20pt">&#160;
	</fo:block>

</xsl:template>

<xsl:template match="Function">

	
	<xsl:if test="./@PreCondition!='' ">
	<fo:block font-size="18pt" font-family="serif" line-height="20pt">	
	//precondition:&#160;<xsl:value-of select="@PreCondition"/>
	</fo:block>
	</xsl:if>
	
	<xsl:if test="./@PostCondition!='' ">
	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
	//postcondition:&#160;<xsl:value-of select="@PostCondition"/>
	</fo:block>
	</xsl:if>

	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
        <fo:inline font-weight="bold">
	  Fonction&#160;<xsl:value-of select="@id"/>
	  </fo:inline>
	  (&#160;
	
	  <xsl:for-each select="ParamDecl/Param">
		 <xsl:value-of select="@Status"/>&#160; 
		 <xsl:value-of select="@id"/>:
	       <xsl:value-of select="@Type"/>

		 <xsl:if test="position() != last()">
               <xsl:text>,  </xsl:text>
             </xsl:if>
        </xsl:for-each>
	  ):&#160;<xsl:value-of select="RetValue/@Var"/>
	</fo:block>

	<xsl:if test="./@Comment!='' ">
	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
	//&#160;<xsl:value-of select="@Comment"/>
	</fo:block>
	</xsl:if>

	<xsl:apply-templates select="LocVarDecl"/>

	<fo:block font-size="18pt" font-family="serif" line-height="20pt" font-weight="bold">
	  d&#233;but
	</fo:block>

	<xsl:apply-templates select="Code"/>
	
	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
	  <fo:inline font-weight="bold">
	  fin </fo:inline>
	  {<xsl:value-of select="@id"/>}
	</fo:block>

	<fo:block font-size="18pt" font-family="serif" line-height="20pt">&#160;
	</fo:block>

</xsl:template>


<xsl:template match="LocVarDecl">
	
	<xsl:apply-templates select="Var"/>
	
</xsl:template>

<xsl:template match="Var">

	<xsl:if test="position() = 1">
	<fo:block font-size="18pt" font-family="serif" line-height="20pt" font-weight="bold">
		var
	</fo:block>
	</xsl:if>

	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
		&#160;<xsl:value-of select="@id"/>&#160;:&#160;<xsl:value-of select="@Type"/>
	</fo:block>
	

</xsl:template>


<xsl:template match="Code">
		
	<fo:list-block provisional-distance-between-starts="18pt"
               provisional-label-separation="3pt">
		<fo:list-item>
			<fo:list-item-label end-indent="label-end()">
			<fo:block></fo:block>
    			</fo:list-item-label>	
			
			<fo:list-item-body start-indent="body-start()">

			<xsl:apply-templates/>

	
			</fo:list-item-body>

		</fo:list-item>
	</fo:list-block>

</xsl:template>



<xsl:template match="While">
	
	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
	<fo:inline font-weight="bold">Tant que</fo:inline>
	&#160;<xsl:value-of select="Cond"/>
	</fo:block>
	
	<xsl:apply-templates select="Code"/>
	
	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
	<fo:inline font-weight="bold">Fin Tant que</fo:inline>
	</fo:block>
			
</xsl:template>


<xsl:template match="Repeat">

	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
	<fo:inline font-weight="bold">Repeter</fo:inline>
	</fo:block>

	<xsl:apply-templates select="Code"/>
	
	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
	<fo:inline font-weight="bold">Jusqu'&#224;</fo:inline>&#160;<xsl:value-of select="Cond"/>
	</fo:block>

</xsl:template>

<xsl:template match="Call">

	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
		<xsl:value-of select="@name"/>
		(
		<xsl:for-each select="ParamVal">
			<xsl:value-of select="@name"/>
			<xsl:if test="position() != last()">
                  	<xsl:text>,  </xsl:text>
            	</xsl:if>
		
		</xsl:for-each>)
	</fo:block>
		
	
</xsl:template>

<xsl:template match="For">

	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
	<fo:inline font-weight="bold">Pour</fo:inline>
	&#160;<xsl:value-of select="@Var"/>&#160;
	<fo:inline font-weight="bold">De</fo:inline>&#160;
	<xsl:value-of select="@FirstValue"/>&#160;
	<fo:inline font-weight="bold"><xsl:value-of select="@Evol"/></fo:inline>&#160;
	<xsl:value-of select="@LastValue"/>
	</fo:block>
	
	<xsl:apply-templates select="Code"/>
	
	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
	<fo:inline font-weight="bold">Fin Pour</fo:inline>
	</fo:block>
	
</xsl:template>


<xsl:template match="Switch">
	
	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
		<fo:inline font-weight="bold">Selon</fo:inline>&#160;
		<xsl:value-of select="@Var"/>&#160;
		<fo:inline font-weight="bold">dans</fo:inline>
	</fo:block>
	<xsl:for-each select="Item">
		<fo:block font-size="18pt" font-family="serif" line-height="20pt">
		<xsl:for-each select="PossVal">
			
				<xsl:value-of select="."/>
				<xsl:if test="position() != last()">
                 	 		<xsl:text>,  </xsl:text>
           			</xsl:if>
			
		</xsl:for-each>
		&#160;:&#160;
		</fo:block>
		<xsl:apply-templates select="Code"/>
	</xsl:for-each>

	<xsl:apply-templates select="DefaultItem"/>
	<fo:block font-size="18pt" font-family="serif" line-height="20pt" font-weight="bold">
	Fin Selon
	</fo:block>
	
</xsl:template>

<xsl:template match="DefaultItem">
	
	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
	<fo:inline font-weight="bold">autrement</fo:inline> :&#160;
	<xsl:apply-templates select="Code"/>
	</fo:block>
	
</xsl:template>


<xsl:template match="Let">	

	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
	<xsl:value-of select="@Var"/>:=
	<xsl:value-of select="."/>
	</fo:block>

</xsl:template>

<xsl:template match="Assert">
	
	<xsl:if test="./@Comment!='' ">
		<fo:block font-size="18pt" font-family="serif" line-height="20pt">
		//&#160;<xsl:value-of select="@Comment"/>
		</fo:block>
	</xsl:if>
	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
		{<xsl:value-of select="."/>}
	</fo:block>
	
</xsl:template>

<xsl:template match="If">

	<fo:block font-size="18pt" font-family="serif" line-height="20pt">
		<fo:inline font-weight="bold">Si&#160;</fo:inline>
		<xsl:value-of select="Cond"/>
	</fo:block>
	
      <fo:block font-size="18pt" font-family="serif" line-height="20pt" font-weight="bold">
	Alors
	</fo:block>
	<xsl:apply-templates select="Then"/>
	
	<fo:block font-size="18pt" font-family="serif" line-height="20pt" font-weight="bold">
	Sinon		
	</fo:block>
	<xsl:apply-templates select="Else"/>
	
</xsl:template>

<xsl:template match="Then">
	
	<xsl:apply-templates select="Code"/>

</xsl:template>

<xsl:template match="Else">
	
	<xsl:apply-templates select="Code"/>

</xsl:template>	



</xsl:stylesheet>
